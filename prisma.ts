import { Prisma, PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
    log: [{ emit: 'event', level: 'query' }, 'info', 'warn', 'error']
})

// for custom logging
prisma.$on("query", (e) => {
    // SQL 명령어 (SELECT, UPDATE 등)
    const type = e.query.split(" ")[0];

    // "public"."Account"."id" → Account.id
    // const colMatches = [
    //     ...e.query.matchAll(/"public"\."([^"]+)"\."([^"]+)"/g),
    // ].map((m) => `${m[1]}.${m[2]}`);

    // // 테이블별로 그룹화
    // const grouped: Record<string, string[]> = {};
    // for (const col of colMatches) {
    //     const [table, column] = col.split(".");
    //     if (!grouped[table]) grouped[table] = [];
    //     if (!grouped[table].includes(column)) {
    //         grouped[table].push(column);
    //     }
    // }

    // // 한 줄 요약 포맷: [SELECT] Account(id,email) User(name)
    // const summary = Object.entries(grouped)
    //     .map(([table, cols]) => `${table}(${cols.join(",")})`)
    //     .join(" ");

    const tableMatches = [...e.query.matchAll(/"public"\."([^"]+)"/g)].map(m => m[1]);
    const tables = [...new Set(tableMatches)];

    // WHERE 절만 추출
    let whereClause = "";
    const whereIndex = e.query.toUpperCase().indexOf("WHERE");
    if (whereIndex !== -1) {
        // "WHERE ..." 부분만 추출해서 불필요한 public 스키마 제거
        whereClause = e.query
            .substring(whereIndex)
            .replace(/"public"\."([^"]+)"\."([^"]+)"/g, "$1.$2")
            .trim();
    }

    console.log(`[${type}] ${tables}${whereClause ? " " + whereClause : ""}\
 ${e.params} (${e.duration}ms)`);
});

const globalForPrisma = global as unknown as { prisma: typeof prisma }

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma
export { Prisma }