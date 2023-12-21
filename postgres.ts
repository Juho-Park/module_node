import Logger from './logger'
const log = new Logger('/module/postgres')

/** reference psql > sudo su postgres
 * createdb {db}
 * \l
 * \c {db}
 * \d {table}
 */

try {
    require('pg')
} catch (e) {
    log.err('Cannot find "pg" module | yarn add pg')
    process.exit(1)
}
import { Pool, Client, QueryResult } from 'pg'

let _pool: Pool
async function pool() {
    if (_pool) return _pool
    const config = getConfig()
    if (!config) {
        log.err('not found PG_ config in .env')
        process.exit(1)
    }
    _pool = new Pool(config)

    try {
        await _pool.query('select 1')
        log.debug('connected postgres')
    } catch (e: any) {
        log.err(e.message)
        process.exit(1)
    }
    return _pool
}

function getConfig() {
    const { PG_HOST, PG_PORT, PG_USER, PG_PASSWORD, PG_DB } = process.env
    const isPG = PG_HOST && PG_PORT && PG_USER && PG_PASSWORD && PG_DB
    if (isPG)
        return {
            host: PG_HOST,
            port: Number(PG_PORT),
            user: PG_USER,
            password: PG_PASSWORD,
            database: PG_DB
        }
}

async function client() {
    let _pool = await pool()
    let client = await _pool.connect()
    await client.query('BEGIN')
    return new TransactionManager(client)
}

class TransactionManager {
    private client
    constructor(client: any) {
        this.client = client
    }
    q(...args: any[]): Promise<QueryResult<any>> {
        return this.client.query(...args)
    }
    row(...args: any[]) {
        return this.q(...args).then(res => res.rows[0])
    }
    rows(...args: any[]) {
        return this.q(...args).then(res => res.rows)
    }
    async commit() {
        await this.client.query('commit')
        this.client.release()
    }
    async rollback() {
        await this.client.query('rollback')
        this.client.release()
    }
}
// WIP; ?? used?
// module.exports.transactionManager = connectClient
// module.exports.client = connectClient
// module.exports.end = () => pool().then(pool => pool.end())

// WIP; not yet interface 
// interface QueryFunc { (q: string, v?: any[]): Promise<QueryResult> }
// interface RowFunc { (q: string, v?: any[]): Promise<T> }
// const q: QueryFunc = (statement, values) => pool().then(p => p.query(statement, values))
// const row: RowFunc = (statement, values) => q(statement, values).then(res => res.rows[0])
// const rows: RowFunc = (statement, values) => q(statement, values).then(res => res.rows)

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
    q(statement, values).then(res => res.rows[0])
const rows = (statement: string, values?: any[]) =>
    q(statement, values).then(res => res.rows)

function toCamel(row: any) {
    let result: any = {}
    for (const key in row) {
        if (row[key]?.constructor === ([]).constructor
            && row[key].length > 0
            && row[key][0].constructor === ({}).constructor
        ) row[key] = row[key].map(toCamel)
        const camelKey = key.replace(/_([a-z])/g, function (g) { return g[1].toUpperCase(); });
        result[camelKey] = row[key];
    }
    return result;
}

export default { q, row, rows, client, toCamel, TransactionManager }
