import { AppCommand } from "./commands";
import { DownloadFile } from "./commands/downloadFile";
import { HistoryGoBack, HistoryPushState, HistoryReplaceState } from "./commands/history";
import { LoadAppConfig } from "./commands/loadAppConfig";
import { LoadFolderMeta } from "./commands/loadFolderMeta";
import { OpenFile } from "./commands/openFile";
import { ReadeFileContent } from "./commands/readFileContent";
import { SaveAppConfig } from "./commands/saveAppConfig";
import { AppConfigLoadedEvent, AppConfigLoadingFailedEvent, AppConfigSavingFailedEvent, AppConfigSubmittedEvent, FileContentLoadedEvent, FileDownloadedEvent, FileDownloadFailedEvent, FileDownloadRequestedEvent, FolderMetaLoadedEvent, FolderMetaLoadingFailedEvent, LocationUpdatedEvent, NavigationRequestedEvent, OpeningFileFailedEvent } from "./events";
import { AppState, FileTreeNode, FileTreeNode_File, FileTreeNode_Folder, FolderMeta, InAppState, RouteType, TreeNodeType, ViewType } from "./model";
import { JustState } from "./reducer";
import { getRoute, HOME_ROUTE } from "./routing";

// Navigation

export const handleNavigationRequested = (
    state: AppState,
    event: NavigationRequestedEvent
): [AppState, AppCommand] => {
    const nextCommandSeq = state.commandSeq + 1;
    const newState: AppState = {
        ...state,
        commandSeq: nextCommandSeq,
    };
    return [newState, HistoryPushState(nextCommandSeq, event.path)];
};

export const handleBackButtonClicked = (
    state: AppState,
): [AppState, AppCommand] => {
    // close preview
    if (state.inAppState.state == InAppState.Ready) {
        if (state.inAppState.view.type == ViewType.FilePreview) {
            const newState: AppState = {
                ...state,
                inAppState: {
                    ...state.inAppState,
                    view: {
                        type: ViewType.FolderView,
                        folder: state.inAppState.view.folder,
                        pendingProgress: false
                    }
                }
            };
            return JustState(newState);
        }
    }

    // nav back
    const nextCommandSeq = state.commandSeq + 1;
    const newState: AppState = {
        ...state,
        commandSeq: nextCommandSeq,
    };
    return [newState, HistoryGoBack(nextCommandSeq)];
};

export const handleLocationUpdatedEvent = (
    state: AppState,
    event: LocationUpdatedEvent
): [AppState, AppCommand] => {
    const route = getRoute(event.path);

    // redirect
    if (route.type == RouteType.Default) {
        const nextCommandSeq = state.commandSeq + 1;
        const newState: AppState = {
            ...state,
            commandSeq: nextCommandSeq,
            route,
        };
        return [newState, HistoryReplaceState(nextCommandSeq, HOME_ROUTE)];
    }
    // update folder
    if (state.inAppState.state == InAppState.Ready) {
        const currentFolder = getFolder(route.folderPath, state.inAppState.fileTree);
        const newState: AppState = {
            ...state,
            route,
            inAppState: {
                ...state.inAppState,
                view: {
                    type: ViewType.FolderView,
                    folder: currentFolder,
                    pendingProgress: false,
                }
            }
        };
        return JustState(newState);
    }
    // not yet ready, just update route
    const newState: AppState = {
        ...state,
        route,
    };
    return JustState(newState);
};

// end: Navigation

export const handleAppConfigLoaded = (
    state: AppState,
    event: AppConfigLoadedEvent
): [AppState, AppCommand] => {
    const nextCommandSeq = state.commandSeq + 1;
    const newState: AppState = {
        ...state,
        commandSeq: nextCommandSeq,
        inAppState: {
            state: InAppState.FolderMetaLoading,
            appConfig: event.appConfig
        }
    };
    return [newState, LoadFolderMeta(nextCommandSeq, event.appConfig)];
};

export const handleAppConfigLoadingFailed = (
    state: AppState,
    event: AppConfigLoadingFailedEvent
): [AppState, AppCommand] => {
    const newState: AppState = {
        ...state,
        inAppState: {
            state: InAppState.AppConfigLoadingFailed,
            err: event.err
        }
    };
    return JustState(newState);
};

export const handleAppConfigSubmitted = (
    state: AppState,
    event: AppConfigSubmittedEvent
): [AppState, AppCommand] => {
    const nextCommandSeq = state.commandSeq + 1;
    const newState: AppState = {
        ...state,
        commandSeq: nextCommandSeq,
        inAppState: {
            state: InAppState.AppConfigSaving,
        }
    };
    return [newState, SaveAppConfig(nextCommandSeq, event.appConfig)];
};

export const handleAppConfigSaved = (
    state: AppState,
): [AppState, AppCommand] => {
    const nextCommandSeq = state.commandSeq + 1;
    const newState: AppState = {
        ...state,
        commandSeq: nextCommandSeq,
        inAppState: {
            state: InAppState.AppConfigLoading,
            // TODO: take advantage of an error to show in the config view
        }
    };
    return [newState, LoadAppConfig(nextCommandSeq)];
};

export const handleAppConfigSavingFailed = (
    state: AppState,
    event: AppConfigSavingFailedEvent
): [AppState, AppCommand] => {
    const newState: AppState = {
        ...state,
        inAppState: {
            state: InAppState.AppConfigSavingFailed,
            appConfig: event.appConfig,
            err: event.err
        }
    };
    return JustState(newState);
};

export const handleFolderMetaLoaded = (
    state: AppState,
    event: FolderMetaLoadedEvent
): [AppState, AppCommand] => {
    if (state.inAppState.state == InAppState.FolderMetaLoading) {
        const fileTree = toFileTree(event.meta);
        const currentFolder = getFolder(
            state.route.type == RouteType.FolderView ? state.route.folderPath : "",
            fileTree);
        const newState: AppState = {
            ...state,
            inAppState: {
                state: InAppState.Ready,
                appConfig: state.inAppState.appConfig,
                fileTree: fileTree,
                view: {
                    type: ViewType.FolderView,
                    folder: currentFolder,
                    pendingProgress: false,
                },
                errors: []
            }
        };
        return JustState(newState);
    }
    return JustState(state);
};

export const handleFolderMetaLoadingFailed = (
    state: AppState,
    event: FolderMetaLoadingFailedEvent
): [AppState, AppCommand] => {
    if (state.inAppState.state == InAppState.FolderMetaLoading) {
        const newState: AppState = {
            ...state,
            inAppState: {
                state: InAppState.FolderMetaLoadingFailed,
                appConfig: state.inAppState.appConfig,
                err: event.err
            }
        };
        // TODO: depending on the error, we could retry
        return JustState(newState);
    }
    return JustState(state);
};

export const handleFileDownloadRequested = (
    state: AppState,
    event: FileDownloadRequestedEvent
): [AppState, AppCommand] => {
    if (state.inAppState.state == InAppState.Ready) {
        const nextCommandSeq = state.commandSeq + 1;
        const newState: AppState = {
            ...state,
            commandSeq: nextCommandSeq,
            inAppState: {
                ...state.inAppState,
                view: {
                    ...state.inAppState.view,
                    type: ViewType.FolderView,
                    pendingProgress: true
                }
            }
        };
        return [newState,
            DownloadFile(nextCommandSeq, state.inAppState.appConfig, event.fileNode)];
    }
    return JustState(state);
};

export const handleFileDownloaded = (
    state: AppState,
    event: FileDownloadedEvent
): [AppState, AppCommand] => {
    if (state.inAppState.state == InAppState.Ready) {
        const previewSupported = isPreviewSupported(event.fileNode.name);

        const nextCommandSeq = state.commandSeq + 1;
        const newState: AppState = {
            ...state,
            commandSeq: nextCommandSeq,
            inAppState: {
                ...state.inAppState,
                view: previewSupported ?
                    {
                        ...state.inAppState.view,
                        type: ViewType.FilePreview,
                        content: undefined
                    } :
                    {
                        ...state.inAppState.view,
                        type: ViewType.FolderView,
                        pendingProgress: false
                    }
            }
        };
        return [
            newState,
            previewSupported ?
                ReadeFileContent(nextCommandSeq, event.localPath) :
                OpenFile(nextCommandSeq, event.localPath)
        ];
    }
    return JustState(state);
};

export const handleFileDownloadFailed = (
    state: AppState,
    event: FileDownloadFailedEvent
): [AppState, AppCommand] => {
    if (state.inAppState.state == InAppState.Ready) {
        const newState: AppState = {
            ...state,
            inAppState: {
                ...state.inAppState,
                view: {
                    ...state.inAppState.view,
                    type: ViewType.FolderView,
                    pendingProgress: false,
                },
                errors: [event.err, ...state.inAppState.errors]
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
    if (state.inAppState.state == InAppState.Ready) {
        const newState: AppState = {
            ...state,
            inAppState: {
                ...state.inAppState,
                errors: [event.err, ...state.inAppState.errors]
            }
        };
        return JustState(newState);
    }
    return JustState(state);
};

export const handleFileContentLoaded = (
    state: AppState,
    event: FileContentLoadedEvent
): [AppState, AppCommand] => {
    if (state.inAppState.state == InAppState.Ready) {
        // TODO: make sure the file is actually the one we are waiting for
        if (state.inAppState.view.type == ViewType.FilePreview) {
            const newState: AppState = {
                ...state,
                inAppState: {
                    ...state.inAppState,
                    view:
                    {
                        type: ViewType.FilePreview,
                        folder: state.inAppState.view.folder,
                        content: event.content
                    }
                }
            };
            return JustState(newState);
        }
    }
    return JustState(state);
};

// TODO: handle FileContentLoadingFailed

// Helpers

// TODO: This is written by AI but seem to work fine
// TODO: brush it up and --unit-test--
// TODO: "/"
export const toFileTree = (folderMeta: FolderMeta): FileTreeNode_Folder => {
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
const getFolder = (path: string, fileTree: FileTreeNode): FileTreeNode_Folder | undefined => {
    if (!path) {
        return fileTree as FileTreeNode_Folder;
    }

    const parts = path
        .split("/")
        .filter(Boolean);

    let current: FileTreeNode_Folder = fileTree as FileTreeNode_Folder;

    for (const part of parts) {
        const next = current.nodes.find(
            (node): node is FileTreeNode_Folder =>
                node.type === TreeNodeType.Folder &&
                node.name === part
        );

        if (!next) {
            return undefined;
        }

        current = next;
    }

    return current;
}

const isPreviewSupported = (fileName: string) => {
    if (fileName.endsWith(".txt")) {
        return true;
    }
    return false;
}