import { FileViewer } from "@capacitor/file-viewer";
import { CommandType, ViewFileCommand } from "../commands";
import { Directory, Filesystem } from "@capacitor/filesystem";
import { EventType } from "../events";

export const ViewFile = (seq: number, path: string): ViewFileCommand => ({
    seq,
    type: CommandType.ViewFile,
    path,
    execute: async (dispatch) => {
        try {
            const { uri } = await Filesystem.getUri({
                directory: Directory.Documents,
                path
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