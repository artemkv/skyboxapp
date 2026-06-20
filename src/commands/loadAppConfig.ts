import { CommandType, LoadAppConfigCommand } from "../commands";
import { loadConfig } from "../configztorage";
import { EventType } from "../events";

export const LoadAppConfig = (seq: number): LoadAppConfigCommand => ({
    seq,
    type: CommandType.LoadAppConfig,
    execute: async (dispatch) => {
        try {
            const appConfig = await loadConfig();
            dispatch({
                type: EventType.AppConfigLoaded,
                appConfig
            });
        } catch (err) {
            dispatch({
                type: EventType.AppConfigLoadingFailed,
                err: `${err}`,
            });
        }
    },
});