import { CommandType, DownloadFileCommand } from "../commands";
import { decrypt, deriveMasterKey } from "../crypto";
import { EventType } from "../events";
import { getFileStats, PATH_SEPARATOR, saveFile } from "../fsconnect";
import { AppConfig, FileMeta, FileTreeNode_File } from "../model";
import { downloadObject, getFileMeta } from "../s3connect";

const SKYBOX_LOCAL_FOLDER = "Skybox";

const FileNonceMetaKey = "nonce";
const FileEncryptionKeyEncryptedMetaKey = "filekey";
const FileEncryptionKeyNonceMetaKey = "filekeynonce";

const parseFileMeta = (meta: { [key: string]: string }): FileMeta => {
    const fileNonce = meta[FileNonceMetaKey];
    if (!fileNonce) {
        throw "file nonce not found in file metadata";
    }
    const fileEncryptionKeyEncrypted = meta[FileEncryptionKeyEncryptedMetaKey];
    if (!fileEncryptionKeyEncrypted) {
        throw "file encryption key not found in file metadata";
    }
    const fileEncryptionKeyNonce = meta[FileEncryptionKeyNonceMetaKey];
    if (!fileEncryptionKeyNonce) {
        throw "file encryption key nonce not found in file metadata";
    }

    return {
        fileNonce,
        fileEncryptionKeyEncrypted,
        fileEncryptionKeyNonce
    };
}

export function base64ToUint8Array(base64: string): Uint8Array {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
}

const makeLocalFilePath = (deviceId: string, fullPath: string[], fileName: string) => {
    const folder = [SKYBOX_LOCAL_FOLDER, deviceId, ...fullPath].join(PATH_SEPARATOR);
    return `${folder}${PATH_SEPARATOR}${fileName}`
}

export const DownloadFile = (seq: number, appConfig: AppConfig, fileNode: FileTreeNode_File): DownloadFileCommand => ({
    seq,
    type: CommandType.DownloadFile,
    appConfig,
    fileNode,
    execute: async (dispatch) => {
        const fullPath = fileNode.fullPath;
        const fileName = fileNode.name;
        const objectKey = fileNode.objectKey;
        const size = fileNode.size;

        try {
            // get local file stats
            const path = makeLocalFilePath(
                appConfig.skyboxConfigs.deviceId, fullPath, fileName);
            const stats = await getFileStats(path);

            // TODO: check etag
            // This will not match when testing on web, 
            // since in browser it would be stored base64-encoded
            if (stats && stats.size == size) {
                // shortcut the download
                console.log("Already downloaded");
                dispatch({
                    type: EventType.FileDownloaded,
                    path,
                });
                return;
            }

            // get file metadata
            // console.log("Retrieving file metadata");
            const fileMetaResult = await getFileMeta(
                appConfig.awsConfig,
                appConfig.skyboxConfigs.bucket,
                appConfig.skyboxConfigs.deviceId,
                objectKey);
            const { fileNonce,
                fileEncryptionKeyEncrypted,
                fileEncryptionKeyNonce } = parseFileMeta(fileMetaResult.meta);

            // get master key
            // TODO: salt should be random and be stored on the account
            // console.log("Deriving master key");
            const masterKey = deriveMasterKey(
                appConfig.skyboxConfigs.secret, "saltsaltsaltsalt");

            // decrypt file key
            // console.log("Decrypting file key");
            const fileEncryptionKey = await decrypt(
                base64ToUint8Array(fileEncryptionKeyEncrypted),
                masterKey,
                base64ToUint8Array(fileEncryptionKeyNonce));

            // get raw bytes
            // console.log("Downloading encrypted file");
            const bytes = await downloadObject(
                appConfig.awsConfig,
                appConfig.skyboxConfigs.bucket,
                appConfig.skyboxConfigs.deviceId,
                objectKey);

            // decrypt file
            // console.log("Decrypting");
            const decrypted = await decrypt(
                bytes,
                fileEncryptionKey,
                base64ToUint8Array(fileNonce));

            // save file
            // console.log("Saving file");
            const blob = new Blob([decrypted]);
            await saveFile(path, blob);

            // dispatch result
            dispatch({
                type: EventType.FileDownloaded,
                path,
            });
        } catch (err) {
            dispatch({
                type: EventType.FileDownloadFailed,
                err: `${err}`,
            });
        }
    },
});