
import { Kysely, MysqlDialect } from 'kysely'
import { createPool } from 'mysql2'

import * as types from './generated'

export * from './generated'

export interface DatabaseTables {
   
}

const pool = createPool({
    enableKeepAlive: true,
    connectionLimit: 30,
    waitForConnections: true,
    // ssl: { rejectUnauthorized: true },
    uri: process.env.DATABASE_URL,
})

export const db = new Kysely<DatabaseTables>({
    dialect: new MysqlDialect({
        pool: pool,
    }),
})

