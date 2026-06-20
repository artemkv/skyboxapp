import { Directory, Encoding, Filesystem } from "@capacitor/filesystem";
import { AppConfig } from "./model";

const CONFIG_FILE_PATH = "net.artemkv.skybox.config.json";

// TODO: use versioned DTOs
// TODO: sanitize

export const saveConfig = async (config: AppConfig) => {
    await Filesystem.writeFile({
        path: CONFIG_FILE_PATH,
        data: JSON.stringify(config),
        directory: Directory.Library,
        encoding: Encoding.UTF8,
    });
};

export const loadConfig = async (): Promise<AppConfig> => {
    const json = await Filesystem.readFile({
        path: CONFIG_FILE_PATH,
        directory: Directory.Library,
        encoding: Encoding.UTF8,
    });

    return JSON.parse(json.data.toString()) as AppConfig;
};