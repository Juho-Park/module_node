import Logger from './logger'
import sqlite from 'sqlite3'
const log = new Logger('/module/sqlite');


let database: sqlite.Database | undefined;

async function get() {
    if (!database) {
        const path = process.env.sqlite_path ?? 'sqlite.db'
        if (!path) {
            log.err('sqlite path is undefined')
            process.exit(1)
        }
        database = new sqlite.Database(path)
    }
    return database;
}


async function run(query: string, params?: Array<any>) {
    let db = await get()
    return new Promise((res, rej) => {
        db.run(query, params, (err: Error | null) => {
            if (err) {
                log.err(err)
                rej(err)
            }
            res(null)
        })
    })
}

async function row(query: string, params?: Array<any>): Promise<any> {
    let db = await get()
    return new Promise((res, rej) => {
        db.get(query, params, (err: Error | null, rows: sqlite.RunResult) => {
            if (err) {
                log.err(err)
                rej(err)
            }
            res(rows)
        })
    })
}
async function rows(query: string, params?: Array<any>): Promise<Array<any>> {
    let db = await get()
    return new Promise((res, rej) => {
        db.all(query, params, (err: Error | null, rows: any) => {
            if (err) {
                log.err(err)
                rej(err)
            }
            res(rows)
        })
    })
}

// async function serialize(queries: Function) {
//     let db = await get()

//     return new Promise(async (res,rej)=>{
//         db.serialize(
//             await queries(db)
//         )
//     })

// }

export default { get, run, row, rows }