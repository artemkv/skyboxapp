import { CommandType, DownloadFileCommand } from "../commands";
import { decrypt, deriveMasterKey } from "../crypto";
import { EventType } from "../events";
import { PATH_SEPARATOR, saveFile } from "../fsconnect";
import { FileMeta } from "../model";
import { downloadObject, getFileMeta } from "../s3connect";
import { SKYBOX_BUCKET, SKYBOX_DEVICEID, SKYBOX_SECRET } from "../UNSAFE";

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

const makeLocalFilePath = (fullPath: string[], fileName: string) => {
    const folder = [SKYBOX_LOCAL_FOLDER, SKYBOX_DEVICEID, ...fullPath].join(PATH_SEPARATOR);
    return `${folder}${PATH_SEPARATOR}${fileName}`
}

export const DownloadFile = (seq: number, fullPath: string[], fileName: string, objectKey: string): DownloadFileCommand => ({
    seq,
    type: CommandType.DownloadFile,
    fullPath,
    fileName,
    objectKey,
    execute: async (dispatch) => {
        try {
            // get master key
            // TODO: salt should be random and be stored on the account
            console.log("Deriving master key");
            const masterKey = deriveMasterKey(SKYBOX_SECRET, "saltsaltsaltsalt");

            // get file metadata
            console.log("Retrieving file metadata");
            const meta = await getFileMeta(SKYBOX_BUCKET, SKYBOX_DEVICEID, objectKey);
            const { fileNonce, fileEncryptionKeyEncrypted, fileEncryptionKeyNonce } = parseFileMeta(meta);

            // decrypt file key
            console.log("Decrypting file key");
            const fileEncryptionKey = await decrypt(
                base64ToUint8Array(fileEncryptionKeyEncrypted),
                masterKey,
                base64ToUint8Array(fileEncryptionKeyNonce));

            // get raw bytes
            console.log("Downloading encrypted file");
            const bytes = await downloadObject(SKYBOX_BUCKET, SKYBOX_DEVICEID, objectKey);

            // decrypt file
            console.log("Decrypting");
            const decrypted = await decrypt(
                bytes,
                fileEncryptionKey,
                base64ToUint8Array(fileNonce));

            // save file
            console.log("Saving file");
            const path = makeLocalFilePath(fullPath, fileName);
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