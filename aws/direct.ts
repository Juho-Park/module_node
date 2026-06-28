/**
 * pp add @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
 */

import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import s3Client from "./client";

export async function getPresigned(fileName: string, contentType: string) {

    const command = new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET,
        Key: fileName,
        ContentType: contentType,
    });

    // 유효 기간 60초짜리 업로드용 URL 생성
    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 60 });

    // 최종적으로 저장될 S3 URL (DB 저장용)
    const fileUrl = `https://${process.env.AWS_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${command.input.Key}`;

    return { signedUrl, fileUrl }
}

export async function _upload(file: File, filePath: string) {
    const fileBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(fileBuffer);

    const command = new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET,
        Key: filePath, // thumbnails 폴더 안에 저장
        Body: uint8Array,
        ContentType: "image/jpeg", // 파일 타입 명시
    });

    try {
        const response = await s3Client.send(command);
        console.log("업로드 성공:", response);

        // 업로드 직후 접근 가능한 URL 반환
        return `https://${process.env.AWS_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${filePath}`;
    } catch (err) {
        console.error("업로드 실패:", err);
        throw err;
    }
}