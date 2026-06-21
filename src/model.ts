// Config

export interface SkyboxConfig {
    bucket: string;
    deviceId: string;
    secret: string;
}

export interface AwsConfig {
    region: string;
    accessKey: string;
    secretKey: string;
}

export interface AppConfig {
    awsConfig: AwsConfig;
    // TODO: should support multiple configs for multiple device ids
    // TODO: and being able to switch between devices
    skyboxConfigs: SkyboxConfig;
}

export const EmptyAppConfig: AppConfig = {
    awsConfig: {
        region: "",
        accessKey: "",
        secretKey: "",
    },
    skyboxConfigs: {
        bucket: "",
        deviceId: "",
        secret: ""
    }
}

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
    path: string;
    size: number;
    hash: string;
}

export interface FolderMeta {
    items: FolderMetaItem[];
}

// File meta

export interface FileMeta {
    fileNonce: string;
    fileEncryptionKeyEncrypted: string;
    fileEncryptionKeyNonce: string;
}

// In app state

export enum InAppState {
    AppConfigLoading,
    AppConfigLoadingFailed,
    AppConfigSaving,
    AppConfigSavingFailed,
    FolderMetaLoading,
    FolderMetaLoadingFailed,
    Ready,
};

export interface InAppState_AppConfigLoading {
    state: InAppState.AppConfigLoading;
}

export interface InAppState_AppConfigLoadingFailed {
    state: InAppState.AppConfigLoadingFailed;
    err: string;
}

export interface InAppState_AppConfigSaving {
    state: InAppState.AppConfigSaving;
}

export interface InAppState_AppConfigSavingFailed {
    state: InAppState.AppConfigSavingFailed;
    appConfig: AppConfig;
    err: string;
}

export interface InAppState_FolderMetaLoading {
    state: InAppState.FolderMetaLoading;
    appConfig: AppConfig;
}

export interface InAppState_FolderMetaLoadingFailed {
    state: InAppState.FolderMetaLoadingFailed;
    appConfig: AppConfig;
    err: string;
}

export interface InAppState_Ready {
    state: InAppState.Ready;
    appConfig: AppConfig;
    fileTree: FileTreeNode;
    pendingDownload: boolean;
    errors: string[];
}

export type InAppStateCurrent =
    | InAppState_AppConfigLoading
    | InAppState_AppConfigLoadingFailed
    | InAppState_AppConfigSaving
    | InAppState_AppConfigSavingFailed
    | InAppState_FolderMetaLoading
    | InAppState_FolderMetaLoadingFailed
    | InAppState_Ready;

// App state

export type AppState = {
    // Last command issued
    commandSeq: number;
    inAppState: InAppStateCurrent;
};

// Initial state

export const IntialState: AppState = {
    commandSeq: 0,
    inAppState: {
        state: InAppState.AppConfigLoading
    },
};