'use server'

import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { createPresignedPost } from '@aws-sdk/s3-presigned-post';
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import Hashids from 'hashids'
import path from 'path'

import dayjs from '@/module/dayjs'
const Region = 'ap-northeast-2'

const s3 = new S3Client({
    region: Region,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
    }
});
const Bucket = process.env.AWS_BUCKET!

export async function getPresignedPost(
    userId: number,
    filepath: string
): Promise<{
    url: string,
    fields: Record<string, string>,
    key: string,
}> {
    const userDirectory = new Hashids().encode(userId)
    const Key = path.join(userDirectory, filepath)
    try {
        const { url, fields } = await createPresignedPost(s3, {
            Bucket,
            Key,
            Conditions: [
                ['content-length-range', 0, 10485760], // up to 10 MB
            ],
            Expires: 600, // Seconds before the presigned post expires. 3600 by default.
        })

        return { url, fields, key: Key }
    } catch (e) {
        if (e instanceof Error)
            console.error(e)
        throw e
    }
}

export async function getObjectPresignedURL(key: string | null): Promise<string> {
    if (!key) return ''
    const command = new GetObjectCommand({
        Bucket,
        Key: key,
    });

    return getSignedUrl(s3, command, { expiresIn: 600 })
    /**
     * expiresIn: [sec]
     */
} 