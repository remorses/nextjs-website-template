
import { Kysely, MysqlDialect } from 'kysely'
import { createPool } from 'mysql2'

import * as types from './generated'

export * from './generated'

export interface DatabaseTables {
   Account: types.SqlAccount,
    Domain: types.SqlDomain,
    Price: types.SqlPrice,
    Product: types.SqlProduct,
    Route: types.SqlRoute,
    Site: types.SqlSite,
    SiteInviteLink: types.SqlSiteInviteLink,
    SitesUsers: types.SqlSitesUsers,
    Subscription: types.SqlSubscription,
    User: types.SqlUser,
    VerificationToken: types.SqlVerificationToken
}

if (!process.env.DATABASE_URL) {
    throw new Error('Kysely has not found a DATABASE_URL in the env')
}
let uri = new URL(process.env.DATABASE_URL!)
let query = "ssl={\"rejectUnauthorized\":true}"
if (query) {
    let q = new URLSearchParams(query)
    for (let k of q.keys()) {
        uri.searchParams.set(k, q.get(k)!)
    }
}


const pool = createPool({
    enableKeepAlive: true,
    connectionLimit: 30,
    waitForConnections: true,
    // ssl: { rejectUnauthorized: true },
    uri: uri.toString(),
})

export const db = new Kysely<DatabaseTables>({
    dialect: new MysqlDialect({
        pool: pool,
    }),
})

