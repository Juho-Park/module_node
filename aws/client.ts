/** 
 * pp add @aws-sdk/client-s3
 * .env
 * AWS_REGION=
 * AWS_BUCKET=
 * AWS_ACCESS_KEY_ID=
 * AWS_SECRET_ACCESS_KEY=
 */
import { S3Client } from "@aws-sdk/client-s3";

// 전역 객체에 s3 타입 정의 (TypeScript용)
const globalForS3 = global as unknown as { s3: S3Client };

const s3 = globalForS3.s3 ||
    new S3Client({
        region: process.env.AWS_REGION || "ap-northeast-2",
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
        },
    });

if (process.env.NODE_ENV !== "production") globalForS3.s3 = s3;

export default s3;