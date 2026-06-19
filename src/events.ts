import { FileTreeNode_File, FolderMeta } from "./model";

export enum EventType {
    // "Never" event is never triggered in the app
    // this is just to make TS happy
    Never,

    FolderMetaLoaded,
    FolderMetaLoadingFailed,

    FileDownloadRequested,
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

export type AppEvent =
    | NeverEvent
    | FolderMetaLoadedEvent
    | FolderMetaLoadingFailedEvent
    | FileDownloadRequestedEvent;