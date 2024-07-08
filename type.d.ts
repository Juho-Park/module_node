
declare namespace Types {
    export interface TransactionManager {
        q: (...p: any[]) => Promise<QueryResult<any>>
        row: (...p: any[]) => Promise<QueryResult<any>>
        rows: (...p: any[]) => Promise<QueryResult<any[]>>
        commit: () => Promise<void>
        rollback: () => Promise<void>
    }
    interface QueryResult {
        rowCount: number
        rows: any[]
    }
}