// File tree

export enum TreeNodeType {
    Folder,
    File,
};

export interface FileTreeNode_Folder {
    type: TreeNodeType.Folder;
    name: string;
    fullPath: string[];
    nodes: FileTreeNode[];
}

export interface FileTreeNode_File {
    type: TreeNodeType.File;
    name: string;
    fullPath: string[];
    size: number;
    objectKey: string;
}

export type FileTreeNode =
    | FileTreeNode_Folder
    | FileTreeNode_File;

// Folder meta

export interface FolderMetaItem {
    path: string,
    size: number,
    hash: string
}

export interface FolderMeta {
    items: FolderMetaItem[]
}

export enum FolderMetaState {
    Loading,
    LoadingFailed,
    Loaded,
};

export interface FolderMetaLoading {
    state: FolderMetaState.Loading;
}

export interface FolderMetaLoadingFailed {
    state: FolderMetaState.LoadingFailed;
    err: string;
}

export interface FolderMetaLoaded {
    state: FolderMetaState.Loaded;
    fileTree: FileTreeNode;
}

export type FolderMetaContainer =
    | FolderMetaLoading
    | FolderMetaLoadingFailed
    | FolderMetaLoaded;

export const LoadingFolderMeta: FolderMetaContainer = {
    state: FolderMetaState.Loading
};

// File meta

export interface FileMeta {
    fileNonce: string,
    fileEncryptionKeyEncrypted: string,
    fileEncryptionKeyNonce: string
}

// App state

export type AppState = {
    // Last command issued
    commandSeq: number;
    folderMeta: FolderMetaContainer;
};

// Initial state

export const IntialState: AppState = {
    commandSeq: 0,
    folderMeta: LoadingFolderMeta,
};