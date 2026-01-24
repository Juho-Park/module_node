'use server'

import { S3Client, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { createPresignedPost } from '@aws-sdk/s3-presigned-post';
import { getSignedUrl as _getSignedUrl } from "@aws-sdk/s3-request-presigner";
const Region = 'ap-northeast-2'

const s3 = new S3Client({
    region: Region,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
    }
});
const Bucket = process.env.AWS_BUCKET!

export async function getSignedUrl(key: string | null) {
    if (!key) return undefined
    const command = new GetObjectCommand({
        Bucket,
        Key: key,
    });

    return _getSignedUrl(s3, command, { expiresIn: 60 * 10 })
    /**
     * expiresIn: [sec]
     */
}
export async function uploadFileToS3(file: File, key: string): Promise<string> {
    const { url, fields } = await getPresignedPost(key);
    const formData = new FormData();
    Object.entries(fields).forEach(([name, value]) => {
        formData.append(name, value);
    });
    formData.append("file", file);

    const response = await fetch(url, {
        method: "POST",
        body: formData,
    });
    if (!response.ok) throw new Error("Failed to upload file");
    return key;
}

/** key: file path */
async function getPresignedPost(
    key: string
): Promise<{
    url: string,
    fields: Record<string, string>,
    key: string,
}> {
    // const userDirectory = new Hashids().encode(userId)
    // const Key = path.join(userDirectory, filepath)
    try {
        const { url, fields } = await createPresignedPost(s3, {
            Bucket,
            Key: key,
            Conditions: [
                ['content-length-range', 0, 10485760], // up to 10 MB
            ],
            Expires: 600, // Seconds before the presigned post expires. 3600 by default.
        })

        return { url, fields, key }
    } catch (e) {
        if (e instanceof Error)
            console.error(e)
        throw e
    }
}

export async function deleteFile(Key: string) {
    await s3.send(new DeleteObjectCommand({
        Bucket,
        Key
    }))
}