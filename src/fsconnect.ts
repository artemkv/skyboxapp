import { Directory, Encoding, Filesystem } from "@capacitor/filesystem";

// TODO: see if there is a better way (maybe some existing constant)
export const PATH_SEPARATOR = "/";

const readBlobContentAsBase64 = async (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const base64Url = reader.result as string;
            resolve(base64Url.substring(base64Url.indexOf(",") + 1));
        };
        reader.onerror = (err) => {
            reject(err);
        };
        reader.readAsDataURL(blob);
    });
};

export const saveFolderMeta = async (path: string, data: string): Promise<void> => {
    await Filesystem.writeFile({
        path,
        data,
        directory: Directory.Library,
        encoding: Encoding.UTF8,
    });
};

export const loadFolderMeta = async (path: string): Promise<string> => {
    const content = await Filesystem.readFile({
        path,
        directory: Directory.Library,
        encoding: Encoding.UTF8,
    });
    return content.data.toString();
};

export const saveFile = async (path: string, blob: Blob): Promise<void> => {
    const data = await readBlobContentAsBase64(blob);
    await Filesystem.writeFile({
        path,
        data,
        directory: Directory.Documents,
        recursive: true
    });
};

export interface FileStats {
    size: number;
}

export const getFileStats = async (path: string): Promise<FileStats | undefined> => {
    try {
        const stats = await Filesystem.stat({
            path,
            directory: Directory.Documents
        });
        return {
            size: stats.size
        };
    } catch {
        return undefined;
    }
}
