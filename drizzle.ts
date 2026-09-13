// version 1.0.0-rc.4
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import relations from '@/drizzle/relations';
import type { PostgresJsTransaction } from 'drizzle-orm/postgres-js';


export type Transaction = PostgresJsTransaction<typeof relations>;

// 전역 객체 타입 확장 (Next.js dev 환경 싱글톤 유지용)
const globalForDb = globalThis as unknown as {
  conn: postgres.Sql | undefined;
};

// 1. 커넥션 클라이언트 생성 (패스워드 없는 dev 환경)
const connectionString = process.env.DATABASE_URL ?? 'postgresql://postgres@localhost:5432/dev_db';

export const client = globalForDb.conn ?? postgres(connectionString);

// 2. 개발 환경일 때만 전역 객체에 커넥션 저장
if (process.env.NODE_ENV !== 'production') {
  globalForDb.conn = client;
}

// 3. Drizzle DB 인스턴스 생성 및 내보내기
const db = drizzle({ client, relations });

export default db;