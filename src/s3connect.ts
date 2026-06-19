import { S3Client, GetObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
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

// TODO: use response.ETag to cache results
// TODO: actually, work on the level of device id, not object key
export const downloadFolderMetadata = async (
    bucket: string, deviceId: string): Promise<string> => {
    const key = makeFolderMetaKey(deviceId);
    const command = new GetObjectCommand({
        Bucket: bucket,
        Key: key,
    });

    const response = await s3client.send(command);
    if (!response.Body) {
        throw new Error(`Error retrieving '${key}' from '${bucket}': empty response`);
    }

    return response.Body.transformToString();
}

export const getFileMetadata = async (
    bucket: string, deviceId: string, objectKey: string): Promise<{ [key: string]: string }> => {
    const key = makeFullObjectKey(deviceId, objectKey);
    const command = new HeadObjectCommand({
        Bucket: bucket,
        Key: key,
    });

    const response = await s3client.send(command);
    if (!response.Metadata) {
        throw new Error(`Error retrieving metadata for '${key}' from '${bucket}'`);
    }

    return response.Metadata;
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
