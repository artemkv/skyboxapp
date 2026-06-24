import { FileViewer } from "@capacitor/file-viewer";
import { CommandType, OpenFileCommand } from "../commands";
import { Directory, Filesystem } from "@capacitor/filesystem";
import { EventType } from "../events";

export const OpenFile = (
    seq: number,
    localPath: string
): OpenFileCommand => ({
    seq,
    type: CommandType.OpenFile,
    localPath,
    execute: async (dispatch) => {
        try {
            const { uri } = await Filesystem.getUri({
                directory: Directory.Documents,
                path: localPath
            });
            await FileViewer.openDocumentFromLocalPath({
                path: uri
            });
        } catch (err) {
            dispatch({
                type: EventType.OpeningFileFailed,
                err: `${err}`
            });
        }
    },
});