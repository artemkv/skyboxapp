import { FileTreeNode_File, FolderMeta } from "./model";

export enum EventType {
    // "Never" event is never triggered in the app
    // this is just to make TS happy
    Never,

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
    file: FileTreeNode_File;
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
    | FolderMetaLoadedEvent
    | FolderMetaLoadingFailedEvent
    | FileDownloadRequestedEvent
    | FileDownloadedEvent
    | FileDownloadFailedEvent
    | OpeningFileFailedEvent;