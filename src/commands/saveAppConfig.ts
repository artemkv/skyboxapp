import { CommandType, SaveAppConfigCommand } from "../commands";
import { saveConfig } from "../configstorage";
import { EventType } from "../events";
import { AppConfig } from "../model";

export const SaveAppConfig = (seq: number, appConfig: AppConfig): SaveAppConfigCommand => ({
    seq,
    type: CommandType.SaveAppConfig,
    appConfig,
    execute: async (dispatch) => {
        try {
            // TODO: here I could validate the config
            // TODO: although this can also be done in the view
            await saveConfig(appConfig);
            dispatch({
                type: EventType.AppConfigSaved,
            });
        } catch (err) {
            dispatch({
                type: EventType.AppConfigSavingFailed,
                appConfig,
                err: `${err}`,
            });
        }
    },
});