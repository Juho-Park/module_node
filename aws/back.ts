// USE in Backend
/**
 * bun add @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
 * AWS_BUCKET=
 * AWS_REGION=
 */
import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import s3Client from "./client";

export async function getPutPresigned(key: string, contentType: string) {
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET,
    Key: key,
    ContentType: contentType,
  });

  // 유효 기간 60초짜리 업로드용 URL 생성
  return getSignedUrl(s3Client, command, { expiresIn: 60 });
}

export async function getS3Url(s3key: string) {
  return `https://${process.env.AWS_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3key}`;
}

export async function putObjectToS3(key: string, contentType: string, body: Buffer | Uint8Array | Blob | string) {
  // // 1. S3 업로드
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET,
    Key: key,
    ContentType: contentType,
    Body: body,
  });

  await s3Client.send(command);
}

export async function getObjectPresigned(key: string, expiresIn: number = 60) {
  const command = new GetObjectCommand({
    Bucket: process.env.AWS_BUCKET,
    Key: key
  })

  return getSignedUrl(s3Client, command, { expiresIn });
}