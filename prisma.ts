import { Prisma, PrismaClient } from '@prisma/client'
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL || '' //Bun.env.DATABASE_URL;
if (!connectionString) {
    throw new Error("❌ DATABASE_URL 환경 변수가 로드되지 않았습니다. .env 파일을 확인하세요.");
}

// 1. pg.Pool 인스턴스를 먼저 생성해야 합니다.
const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
});
const globalForPrisma = global as unknown as { prisma: PrismaClient }

const prisma = globalForPrisma.prisma ?? new PrismaClient({
    adapter,
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

/** @deprecated */
// export default prisma
export { Prisma }