import { LoadFolderMeta } from "./commands/loadFolderMeta";
import { AppEvent } from "./events";
import { Command } from "./hooks/useReducer";
import { FileTreeNode_File } from "./model";

export enum CommandType {
    DoNothing,
    DoMany,

    LoadFolderMeta,
    DownloadFile,

    ViewFile
}

export interface DoNothingCommand extends Command<AppEvent> {
    type: CommandType.DoNothing;
}

export interface DoManyCommand extends Command<AppEvent> {
    type: CommandType.DoMany;
    commands: AppCommand[];
}

export interface LoadFolderMetaCommand extends Command<AppEvent> {
    type: CommandType.LoadFolderMeta;
}

export interface DownloadFileCommand extends Command<AppEvent> {
    type: CommandType.DownloadFile;
    fileNode: FileTreeNode_File;
}

export interface ViewFileCommand extends Command<AppEvent> {
    type: CommandType.ViewFile;
    path: string;
}

export type AppCommand =
    | DoNothingCommand
    | DoManyCommand
    | LoadFolderMetaCommand
    | DownloadFileCommand
    | ViewFileCommand;

export const DoNothing: DoNothingCommand = {
    seq: -1,
    type: CommandType.DoNothing,
    execute: () => { },
};

export const DoMany = (seq: number, commands: AppCommand[]): DoManyCommand => ({
    seq,
    type: CommandType.DoMany,
    commands,
    execute: async (dispatch) => {
        commands.forEach((c) => c.execute(dispatch));
    },
});

// Initial command

export const InitialCommand = LoadFolderMeta(0);
