import 'dotenv/config';
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "@drizzle";

// globalThis 환경에 pool과 db 인스턴스 타입을 확장 선언합니다.
const globalForDb = globalThis as unknown as {
  pool: Pool;
  db: ReturnType<typeof drizzle>;
};

// 1. 커넥션 풀 싱글톤 유지
export const pool = globalForDb.pool ?? new Pool({
  connectionString: process.env.DATABASE_URL!,
  // 팁: 과도기 동안 Prisma와 병행 사용 시 max 연결 수를 제한하는 것이 안전합니다.
  max: 10,
});

// 2. Drizzle DB 클라이언트 싱글톤 유지
// const rawDB = globalForDb.db ?? drizzle({ client: pool, schema });
const rawDB = drizzle({ client: pool, schema }); // relations 추가
const db = rawDB as ReturnType<typeof drizzle<typeof schema>>;

// 개발(development) 환경일 때만 globalThis 객체에 인스턴스를 저장하여 핫 리로드 시 재사용합니다.
if (process.env.NODE_ENV !== "production") {
  globalForDb.pool = pool;
  globalForDb.db = db;
}

export default db;