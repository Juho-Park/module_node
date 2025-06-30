
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { createPresignedPost } from '@aws-sdk/s3-presigned-post';
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import path from 'path'
import * as utils from '@/utils'
import dayjs from '@/module/dayjs'
const Region = 'ap-northeast-2'

const s3 = new S3Client({
    region: Region,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
    }
});
const Bucket = process.env.AWS_BUCKET

export async function getPresignedPostURL(filename: string) {
    const token = await utils.cookie.getAuthToken()
    if (!token) throw new Error('Not found auth token')

    const userDirectory = Buffer.alloc(token.id).toString('base64url')
    const ext = path.extname(filename)
    const key = path.join(userDirectory, 'tutor',
        `profile_image_${dayjs().format('YYMMDD_HHmmss')}${ext}`)
    try {
        const { url, fields } = await createPresignedPost(s3, {
            Bucket: process.env.AWS_BUCKET,
            Key: key,
            Conditions: [
                ['content-length-range', 0, 10485760], // up to 10 MB
                // ['starts-with', '$Content-Type', contentType],
            ],
            // Fields: {
            // acl: 'public-read',
            // 'Content-Type': contentType,
            // },
            Expires: 600, // Seconds before the presigned post expires. 3600 by default.
        })

        return Response.json({ url, fields, key })
    } catch (e) {
        if (e instanceof Error) {
            console.error(e)
            return Response.json({ error: e.message })
        }
        else throw e
    }
}

export async function getObjectPresignedURL(key: string) {
    const command = new GetObjectCommand({
        Bucket,
        Key: key,
    });

    return getSignedUrl(s3, command, { expiresIn: 600 })
    /**
     * expiresIn: [sec]
     */
} 