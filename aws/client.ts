/** 
 * bun add @aws-sdk/client-s3
 * .env
 * AWS_REGION=
 * AWS_ACCESS_KEY_ID=
 * AWS_SECRET_ACCESS_KEY=
 */
import { S3Client } from "@aws-sdk/client-s3";

// globalThis에 s3Client 타입 정의 확장 (TypeScript 전용)
const globalForS3 = globalThis as unknown as {
  s3Client: S3Client | undefined;
};

// 이미 생성된 인스턴스가 있으면 재사용하고, 없으면 새로 생성
const s3 = globalForS3.s3Client ??
  new S3Client({
    region: process.env.AWS_REGION!,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  });

// 프로덕션 환경이 아닐 때(개발 환경 핫 리로드 대응) globalThis에 인스턴스 보존
if (process.env.NODE_ENV !== 'production') {
  globalForS3.s3Client = s3;
}

export default s3