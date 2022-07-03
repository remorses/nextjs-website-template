
import { Kysely, MysqlDialect } from 'kysely'
import { createPool } from 'mysql2'

import * as types from './generated'

export * from './generated'

export interface DatabaseTables {
   Account: types.SqlAccount,
    Campaign: types.SqlCampaign,
    Org: types.SqlOrg,
    OrgsUsers: types.SqlOrgsUsers,
    Price: types.SqlPrice,
    Product: types.SqlProduct,
    ScrapedTweet: types.SqlScrapedTweet,
    Subscription: types.SqlSubscription,
    User: types.SqlUser,
    VerificationToken: types.SqlVerificationToken
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

