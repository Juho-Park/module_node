/** READ.ME
 * # install
 * yarn add pg
 * yarn add -D @types/pg
 * # env
 * PG_CONNECTION=
 */

// reference
// https://www.notion.so/Cheats-13813b063b5880109b13ebe4ba044dac?pvs=4#13e13b063b5880c0abcdcc2a908dd25f

import { Pool, Client, QueryResult, DatabaseError, PoolClient, Submittable } from 'pg'

let _pool: Pool
/** @deprecated: implement Client class */
async function pool() {
    if (_pool) return _pool
    const { PG_CONNECTION } = process.env
    _pool = new Pool({ connectionString: PG_CONNECTION })

    try {
        // await _pool.query('select 1')
        await _pool.query(`set timezone to 'UTC'`)
        console.debug('connected postgres')
    } catch (e) {
        if (e instanceof DatabaseError)
            console.error(e.message)
        process.exit(1)
    }
    return _pool
}

const q = (statement: string, values?: any[]) =>
    pool().then(p => p.query(statement, values))
/**
 * select query result sample
 * command: 'SELECT'
 * rowCount: 1
 * rows: [{idx: 1}]
 * fields: [{name: 'idx', ...}]
 */
const row = (statement: string, values?: any[]) =>
    q(statement, values).then(res => toCamel(res.rows[0]))
const rows = (statement: string, values?: any[]) =>
    q(statement, values).then(res => res.rows.map(toCamel))

const exceptions = ['c_cc', 'c_ps', 'c_gm']
function toCamel(row: any) {
    let result: any = {}
    for (const key in row) {
        if (row[key]?.constructor === ([]).constructor
            && row[key].length > 0
            && row[key][0]?.constructor === ({}).constructor)
            row[key] = row[key].map(toCamel)
        else if (row[key]?.constructor === ({}).constructor)
            row[key] = toCamel(row[key])
        if (exceptions.includes(key)) result[key] = row[key] // except
        else {
            const camelKey = key.replace(/_([a-z])/g, function (g) { return g[1].toUpperCase(); });
            result[camelKey] = row[key];
        }
    }
    return result;
}

class NewTransactionManager {
    private static pool: Pool;

    constructor() {
        if (NewTransactionManager.pool) return
        if (!process.env.PG_CONNECTION) throw new Error('Not found connection string; PG_CONNECTION')

        NewTransactionManager.pool = new Pool({ connectionString: process.env.PG_CONNECTION });
    }

    /**
     * 트랜잭션 내에서 주어진 작업을 실행합니다.
     * @param task 트랜잭션 작업을 수행하는 비동기 함수
     * @returns 작업의 결과
     * @throws 작업 도중 예외 발생 시 롤백 처리 후 에러를 다시 던짐
     */
    async executeTransaction<T>(
        task: (client: PoolClient) => Promise<T>
    ): Promise<T> {
        const client = await NewTransactionManager.getClient();
        try {
            await client.query("BEGIN");
            const result = await task(client);
            await client.query("COMMIT");
            return result;
        } catch (error) {
            await client.query("ROLLBACK");
            throw error;
        } finally {
            client.release();
        }
    }
    static getClient(): Promise<PoolClient> {
        if (!NewTransactionManager.pool) {
            throw new Error("TransactionManager has not been initialized.");
        }
        return NewTransactionManager.pool.connect();
    }
    /**
     * Pool 객체를 반환합니다.
     */
    static getPool(): Pool {
        if (!NewTransactionManager.pool) {
            throw new Error("TransactionManager has not been initialized.");
        }
        return NewTransactionManager.pool;
    }

    /**
     * Pool 종료 (애플리케이션 종료 시 사용)
     */
    static async endPool(): Promise<void> {
        if (NewTransactionManager.pool) {
            await NewTransactionManager.pool.end();
        }
    }
}
/** usesage example
// TransactionManager 초기화
const transactionManager = new TransactionManager(config);

// 트랜잭션 작업 예제
async function exampleTransaction() {
  try {
    const result = await transactionManager.executeTransaction(async (client) => {
      const userInsert: QueryResult = await client.query(
        "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING id",
        ["John Doe", "john@example.com"]
      );

      const userId = userInsert.rows[0].id;

      await client.query(
        "INSERT INTO profiles (user_id, bio) VALUES ($1, $2)",
        [userId, "This is John's profile."]
      );

      return userId;
    });

    console.log("Transaction succeeded with user ID:", result);
  } catch (error) {
    console.error("Transaction failed:", error);
  }
}
 */

/** Warning
(node:41600) MaxListenersExceededWarning: Possible EventEmitter memory leak detected. 11 SIGINT listeners added to [process]. Use emitter.setMaxListeners() to increase limit
(Use `node --trace-warnings ...` to show where the warning was created)
 */
// const shutdown = async () => {
//     await NewTransactionManager.endPool()
//     process.exit(0)
// }
// process.on('SIGINT', shutdown)
// process.on('SIGTERM', shutdown)

export default {
    q, row, rows, toCamel,
    NewTransactionManager,
    Error: DatabaseError
}
