import { S3Client, GetObjectCommand, HeadObjectCommand, S3ServiceException } from "@aws-sdk/client-s3";
import { AWS_ACCESS_KEY_ID, AWS_REGION, AWS_SECRET_ACCESS_KEY } from './UNSAFE.js';

const s3client = new S3Client({
    region: AWS_REGION,
    credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY,
    },
});

const makeFolderMetaKey = (deviceId: string): string => {
    return `${deviceId}/_folder.meta`;
}

const makeFullObjectKey = (deviceId: string, hash: string): string => {
    return `${deviceId}/${hash}`;
}

export enum FolderMetaResultType {
    FolderMeta,
    NotModified,
}

export interface FolderMetaResult_FolderMeta {
    type: FolderMetaResultType.FolderMeta;
    meta: string;
    etag: string;
}

export interface FolderMetaResult_NotModified {
    type: FolderMetaResultType.NotModified;
}

export type FolderMetaResult = FolderMetaResult_FolderMeta | FolderMetaResult_NotModified;

export const downloadFolderMeta = async (
    bucket: string, deviceId: string, etag: string): Promise<FolderMetaResult> => {
    const key = makeFolderMetaKey(deviceId);
    const command = new GetObjectCommand({
        Bucket: bucket,
        Key: key,
        IfNoneMatch: etag
    });

    try {
        const response = await s3client.send(command);
        if (!response.Body) {
            throw new Error(`Error retrieving '${key}' from '${bucket}': empty response`);
        }

        return {
            type: FolderMetaResultType.FolderMeta,
            meta: await response.Body.transformToString(),
            etag: response.ETag ?? ''
        };
    } catch (err) {
        if (err instanceof S3ServiceException) {
            if (err.$metadata.httpStatusCode === 304) {
                return {
                    type: FolderMetaResultType.NotModified
                };
            }
        }
        throw err;
    }
}

export interface FileMetaResult {
    meta: { [key: string]: string };
    etag: string;
}

export const getFileMeta = async (
    bucket: string, deviceId: string, objectKey: string): Promise<FileMetaResult> => {
    const key = makeFullObjectKey(deviceId, objectKey);
    const command = new HeadObjectCommand({
        Bucket: bucket,
        Key: key,
    });

    const response = await s3client.send(command);
    if (!response.Metadata) {
        throw new Error(`Error retrieving metadata for '${key}' from '${bucket}'`);
    }

    return {
        meta: response.Metadata,
        etag: response.ETag ?? ''
    };
}

// TODO: this now downloads everything to memory
// TODO: Ideally, I should stream. But that would require native plugin
export const downloadObject = async (
    bucket: string, deviceId: string, objectKey: string): Promise<Uint8Array> => {
    const key = makeFullObjectKey(deviceId, objectKey);
    const command = new GetObjectCommand({
        Bucket: bucket,
        Key: key,
    });

    const response = await s3client.send(command);
    if (!response.Body) {
        throw new Error(`Error retrieving '${key}' from '${bucket}': empty response`);
    }

    return response.Body.transformToByteArray();
}
