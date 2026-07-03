import { CommandType, ReadeFileContentCommand } from "../commands";
import { EventType } from "../events";
import { loadFileContentAsText } from "../fsconnect";

export const ReadeFileContent = (seq: number, localPath: string): ReadeFileContentCommand => ({
    seq,
    type: CommandType.ReadeFileContent,
    localPath,
    execute: async (dispatch) => {
        try {
            const content = await loadFileContentAsText(localPath);
            dispatch({
                type: EventType.FileContentLoaded,
                content
            });
        } catch (err) {
            dispatch({
                type: EventType.FileContentLoadingFailed,
                err: `${err}`
            });
        }
    },
});