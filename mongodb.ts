import { Collection, Db, MongoClient } from 'mongodb'

const { MG_CONNECTION: CONNECTION, MG_DB: DB, MG_COLLECTION: COLLECTION } = process.env
class MongoDB {
    private static instance: MongoDB;
    private client: MongoClient | null = null;
    private db: Db | null = null;
    private collection: Collection | null = null;

    // 생성자를 private으로 설정하여 외부에서 인스턴스 생성 방지
    private constructor() { }

    public static getInstance(): MongoDB {
        if (!MongoDB.instance)
            MongoDB.instance = new MongoDB();
        return MongoDB.instance;
    }

    async connect(): Promise<Collection> {
        if (this.collection) return this.collection

        if (!this.client) {
            this.client = new MongoClient(CONNECTION ?? '');
            await this.client.connect();
        }
        if (!this.db) {
            this.db = this.client.db(DB);
        }
        if (!this.collection) {
            this.collection = this.db.collection(COLLECTION ?? '');
        }

        console.log('Mongo DB:', this.db.databaseName,
            ' | Collection:', this.collection.collectionName);

        return this.collection;
    }

    public disconnect() {
        if (!this.client) return
        console.log("Closing MongoDB connection...");
        return this.client.close();
    }


    /**
     * Insert a document into a collection.
     * @param {Object} document - The document to insert.
     * @returns {Promise<InsertOneResult>} MongoDB InsertOneResult.
     */
    async insertOne(document: Object) {
        const _collection = this.collection ?? await this.connect()
        return _collection.insertOne(document);
    }

    /**
     * Find documents in a collection.
     * @param {Object} query - The query to filter documents.
     * @param {Object} [options] - Additional query options.
     * @returns {Promise<Array>} Array of documents.
     */
    async find(query: Object, options?: Object, limit?: number) {
        const _collection = this.collection ?? await this.connect()
        let cursor = _collection.find(query, options)
        if (limit) cursor = cursor.limit(limit)
        return cursor.toArray();
    }

    /**
     * Update a document in a collection.
     * @param {Object} filter - The filter to locate the document.
     * @param {Object} update - The update operation.
     * @returns {Promise<UpdateResult>} MongoDB UpdateResult.
     */
    async updateOne(filter: Object, update: Object) {
        const _collection = this.collection ?? await this.connect()
        return _collection.updateOne(filter, update);
    }

    /**
     * Delete a document from a collection.
     * @param {Object} filter - The filter to locate the document.
     * @returns {Promise<DeleteResult>} MongoDB DeleteResult.
     */
    async deleteOne(filter: Object) {
        const _collection = this.collection ?? await this.connect()
        return _collection.deleteOne(filter);
    }
}

/** Warning
(node:41600) MaxListenersExceededWarning: Possible EventEmitter memory leak detected. 11 SIGINT listeners added to [process]. Use emitter.setMaxListeners() to increase limit
(Use `node --trace-warnings ...` to show where the warning was created)
 */
// const shutdown = async () => {
//     const instance = MongoDB.getInstance()
//     await instance.disconnect()
//     process.exit(0)
// }
// process.on('SIGINT', shutdown)
// process.on('SIGTERM', shutdown)

export default MongoDB.getInstance();