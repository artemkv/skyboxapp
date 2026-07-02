import { AppConfig, FileTreeNode_File, FolderMeta } from "./model";

export enum EventType {
    // "Never" event is never triggered in the app
    // this is just to make TS happy
    Never,

    NavigationRequested,
    LocationUpdated,
    BackButtonClicked,

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

// History

export interface NavigationRequestedEvent {
    type: EventType.NavigationRequested;
    path: string;
}

export interface LocationUpdatedEvent {
    type: EventType.LocationUpdated;
    path: string;
}

export interface BackButtonClickedEvent {
    type: EventType.BackButtonClicked;
}

// end of: History

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
}

export interface FileDownloadedEvent {
    type: EventType.FileDownloaded;
    path: string;
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
    | NavigationRequestedEvent
    | LocationUpdatedEvent
    | BackButtonClickedEvent
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