import { Directory, Filesystem } from "@capacitor/filesystem";

// TODO: see if there is a better way
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

export const saveFile = async (path: string, blob: Blob): Promise<void> => {
    const data = await readBlobContentAsBase64(blob);
    await Filesystem.writeFile({
        path,
        data,
        directory: Directory.Documents,
        recursive: true
    });
};