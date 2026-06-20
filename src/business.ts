import { AppCommand } from "./commands";
import { DownloadFile } from "./commands/downloadFile";
import { ViewFile } from "./commands/viewFile";
import { FileDownloadedEvent, FileDownloadFailedEvent, FileDownloadRequestedEvent, FolderMetaLoadedEvent, FolderMetaLoadingFailedEvent, OpeningFileFailedEvent } from "./events";
import { AppState, FileTreeNode, FileTreeNode_File, FileTreeNode_Folder, FolderMeta, FolderMetaLoaded, FolderMetaState, TreeNodeType } from "./model";
import { JustState } from "./reducer";

export const handleFolderMetaLoaded = (
    state: AppState,
    event: FolderMetaLoadedEvent
): [AppState, AppCommand] => {
    const newState: AppState = {
        ...state,
        folderMeta: {
            state: FolderMetaState.Loaded,
            fileTree: toFileTree(event.meta),
            errors: []
        }
    };
    return JustState(newState);
};

export const handleFolderMetaLoadingFailed = (
    state: AppState,
    event: FolderMetaLoadingFailedEvent
): [AppState, AppCommand] => {
    const newState: AppState = {
        ...state,
        folderMeta: {
            state: FolderMetaState.LoadingFailed,
            err: event.err
        }
    };
    return JustState(newState);
};

export const handleFileDownloadRequested = (
    state: AppState,
    event: FileDownloadRequestedEvent
): [AppState, AppCommand] => {
    if (state.folderMeta.state == FolderMetaState.Loaded) {
        const nextCommandSeq = state.commandSeq + 1;
        const newState: AppState = {
            ...state,
            commandSeq: nextCommandSeq,
            folderMeta: {
                ...state.folderMeta,
                pendingDownload: true
            }
        };
        const downloadCommand = DownloadFile(
            nextCommandSeq, event.file.fullPath, event.file.name, event.file.objectKey);
        return [newState, downloadCommand];
    }
    return JustState(state);
};

export const handleFileDownloaded = (
    state: AppState,
    event: FileDownloadedEvent
): [AppState, AppCommand] => {
    if (state.folderMeta.state == FolderMetaState.Loaded) {
        const nextCommandSeq = state.commandSeq + 1;
        const newState: AppState = {
            ...state,
            commandSeq: nextCommandSeq,
            folderMeta: {
                ...state.folderMeta,
                pendingDownload: false
            }
        };
        return [newState, ViewFile(nextCommandSeq, event.path)];
    }
    return JustState(state);
};

export const handleFileDownloadFailed = (
    state: AppState,
    event: FileDownloadFailedEvent
): [AppState, AppCommand] => {
    if (state.folderMeta.state == FolderMetaState.Loaded) {
        const newState: AppState = {
            ...state,
            folderMeta: {
                ...state.folderMeta,
                pendingDownload: false,
                errors: [event.err, ...state.folderMeta.errors]
            }
        };
        return JustState(newState);
    }
    return JustState(state);
};

export const handleOpeningFileFailed = (
    state: AppState,
    event: OpeningFileFailedEvent
): [AppState, AppCommand] => {
    if (state.folderMeta.state == FolderMetaState.Loaded) {
        const newState: AppState = {
            ...state,
            folderMeta: {
                ...state.folderMeta,
                errors: [event.err, ...state.folderMeta.errors]
            }
        };
        return JustState(newState);
    }
    return JustState(state);
};

// Helpers

// TODO: This is written by AI but seem to work fine
// TODO: brush it up and --unit-test--
// TODO: "/"
export const toFileTree = (folderMeta: FolderMeta): FileTreeNode => {
    const root: FileTreeNode_Folder = {
        type: TreeNodeType.Folder,
        name: "",
        fullPath: [],
        nodes: [],
    };

    // Map fullPath string -> folder node
    const folderMap = new Map<string, FileTreeNode_Folder>();
    folderMap.set("", root);

    const getFolderKey = (parts: string[]) => parts.join("/");

    for (const item of folderMeta.items) {
        const parts = item.path.split("/").filter(Boolean);

        let currentPath: string[] = [];
        let parent = root;

        // build folders
        for (let i = 0; i < parts.length - 1; i++) {
            const segment = parts[i];
            currentPath = [...currentPath, segment];

            const key = getFolderKey(currentPath);

            let folder = folderMap.get(key);
            if (!folder) {
                folder = {
                    type: TreeNodeType.Folder,
                    name: segment,
                    fullPath: [...currentPath],
                    nodes: [],
                };
                folderMap.set(key, folder);
                parent.nodes.push(folder);
            }

            parent = folder;
        }

        // file node (last segment)
        const fileName = parts[parts.length - 1];

        const fileNode: FileTreeNode_File = {
            type: TreeNodeType.File,
            fullPath: parts.slice(0, parts.length - 1),
            name: fileName,
            size: item.size,
            objectKey: item.hash,
        };

        parent.nodes.push(fileNode);
    }

    return root;
}

// TODO: written by AI
// TODO: brush it up and unit-test
// TODO: fails on spaces, so need to make sure to decode the url
export const getFolder = (path: string, meta: FolderMetaLoaded): FileTreeNode_Folder | null => {
    if (!path) {
        return meta.fileTree as FileTreeNode_Folder;
    }

    const parts = path
        .split("/")
        .filter(Boolean);

    let current: FileTreeNode_Folder = meta.fileTree as FileTreeNode_Folder;

    for (const part of parts) {
        const next = current.nodes.find(
            (node): node is FileTreeNode_Folder =>
                node.type === TreeNodeType.Folder &&
                node.name === part
        );

        if (!next) {
            return null;
        }

        current = next;
    }

    return current;
}