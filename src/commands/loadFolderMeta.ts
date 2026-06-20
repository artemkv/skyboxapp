import { CommandType, LoadFolderMetaCommand } from "../commands";
import { EventType } from "../events";
import { loadFolderMeta, saveFolderMeta } from "../fsconnect";
import { AppConfig, FolderMeta } from "../model";
import { downloadFolderMeta, FolderMetaResultType } from "../s3connect";

export interface FolderMetaCached {
    meta: FolderMeta,
    etag: string
}

const EmptyFolderMetaCache: FolderMetaCached = {
    meta: {
        items: []
    },
    etag: ""
}

const loadFromCache = async (folderMetaCacheFileName: string): Promise<FolderMetaCached> => {
    try {
        const metaJson = await loadFolderMeta(folderMetaCacheFileName);
        // TODO: now I just assert. I need to propertly sanitize
        const metaCache = JSON.parse(metaJson) as FolderMetaCached;
        return metaCache;
    } catch {
        return EmptyFolderMetaCache;
    }
}

export const LoadFolderMeta = (seq: number, appConfig: AppConfig): LoadFolderMetaCommand => ({
    seq,
    type: CommandType.LoadFolderMeta,
    appConfig,
    execute: async (dispatch) => {
        try {
            // try loading from cache first
            const folderMetaCacheFileName = `${appConfig.skyboxConfigs.deviceId}_foldermeta.json`;
            const metaCache = await loadFromCache(folderMetaCacheFileName);

            // retrieve folder meta from cloud, if changed
            const folderMetaResult = await downloadFolderMeta(
                appConfig.awsConfig,
                appConfig.skyboxConfigs.bucket,
                appConfig.skyboxConfigs.deviceId,
                metaCache.etag);

            // got new meta
            if (folderMetaResult.type == FolderMetaResultType.FolderMeta) {
                // TODO: now I just assert. I need to propertly sanitize
                const meta = JSON.parse(folderMetaResult.meta) as FolderMeta;

                // update cache
                if (folderMetaResult.etag) {
                    const folderMetaCache: FolderMetaCached = {
                        meta,
                        etag: folderMetaResult.etag
                    }
                    saveFolderMeta(folderMetaCacheFileName, JSON.stringify(folderMetaCache));
                }

                // dispatch the result
                dispatch({
                    type: EventType.FolderMetaLoaded,
                    meta,
                });
            } else {
                // using cached meta
                // console.log("using cached meta");
                dispatch({
                    type: EventType.FolderMetaLoaded,
                    meta: metaCache.meta
                });
            }
        } catch (err) {
            dispatch({
                type: EventType.FolderMetaLoadingFailed,
                err: `${err}`,
            });
        }
    },
});