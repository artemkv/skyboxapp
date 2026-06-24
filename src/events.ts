import { AppConfig, FileTreeNode_File, FolderMeta, NavigateForward } from "./model";

export enum EventType {
    // "Never" event is never triggered in the app
    // this is just to make TS happy
    Never,

    AppConfigLoaded,
    AppConfigLoadingFailed,

    AppConfigSubmitted,
    AppConfigSaved,
    AppConfigSavingFailed,

    FolderMetaLoaded,
    FolderMetaLoadingFailed,

    FileDownloadRequested,
    FileDownloaded,
    FileDownloadFailed,

    OpeningFileFailed,
}

export interface NeverEvent {
    type: EventType.Never;
}

export interface AppConfigLoadedEvent {
    type: EventType.AppConfigLoaded;
    appConfig: AppConfig;
}

export interface AppConfigLoadingFailedEvent {
    type: EventType.AppConfigLoadingFailed;
    err: string;
}

export interface AppConfigSubmittedEvent {
    type: EventType.AppConfigSubmitted;
    appConfig: AppConfig;
}

export interface AppConfigSavedEvent {
    type: EventType.AppConfigSaved;
}

export interface AppConfigSavingFailedEvent {
    type: EventType.AppConfigSavingFailed;
    appConfig: AppConfig;
    err: string;
}

export interface FolderMetaLoadedEvent {
    type: EventType.FolderMetaLoaded;
    meta: FolderMeta;
}

export interface FolderMetaLoadingFailedEvent {
    type: EventType.FolderMetaLoadingFailed;
    err: string;
}

export interface FileDownloadRequestedEvent {
    type: EventType.FileDownloadRequested;
    fileNode: FileTreeNode_File;
    navigate: NavigateForward;
}

export interface FileDownloadedEvent {
    type: EventType.FileDownloaded;
    fileNode: FileTreeNode_File;
    localPath: string;
    navigate: NavigateForward;
}

export interface FileDownloadFailedEvent {
    type: EventType.FileDownloadFailed;
    err: string;
}

export interface OpeningFileFailedEvent {
    type: EventType.OpeningFileFailed;
    err: string;
}

export type AppEvent =
    | NeverEvent
    | AppConfigLoadedEvent
    | AppConfigLoadingFailedEvent
    | AppConfigSubmittedEvent
    | AppConfigSavedEvent
    | AppConfigSavingFailedEvent
    | FolderMetaLoadedEvent
    | FolderMetaLoadingFailedEvent
    | FileDownloadRequestedEvent
    | FileDownloadedEvent
    | FileDownloadFailedEvent
    | OpeningFileFailedEvent;