import { CommandType, LoadFolderMetaCommand } from "../commands";
import { EventType } from "../events";
import { FolderMeta } from "../model";
import { downloadFolderMetadata } from "../s3connect";
import { SKYBOX_BUCKET, SKYBOX_DEVICEID } from "../UNSAFE";

export const LoadFolderMeta = (seq: number): LoadFolderMetaCommand => ({
    seq,
    type: CommandType.LoadFolderMeta,
    execute: async (dispatch) => {
        try {
            const metaJson = await downloadFolderMetadata(
                SKYBOX_BUCKET, SKYBOX_DEVICEID);

            // TODO: now I just assert. I need to propertly sanitize
            const meta = JSON.parse(metaJson) as FolderMeta;
            dispatch({
                type: EventType.FolderMetaLoaded,
                meta,
            });
        } catch (err) {
            dispatch({
                type: EventType.FolderMetaLoadingFailed,
                err: `${err}`,
            });
        }
    },
});