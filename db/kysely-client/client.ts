
import { Kysely, MysqlDialect } from 'kysely'
import { createPool } from 'mysql2'

import * as types from './generated'

export * from './generated'

interface Database {
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

// only 1 connection at a time because initial connection is slow af
const pool = createPool({
    enableKeepAlive: true,
    connectionLimit: 30,
    waitForConnections: true,
    ...parseUrl(process.env.DATABASE_URL),
    ssl: { rejectUnauthorized: true },
})

export const db = new Kysely<Database>({
    dialect: new MysqlDialect({
        pool: pool,
    }),
})

function parseUrl(url) {
    const parsedUrl = new URL(url)
    const options: any = {
        host: parsedUrl.hostname,
        port: parsedUrl.port,
        database: parsedUrl.pathname.substr(1),
        user: parsedUrl.username,
        password: parsedUrl.password,
    }
    parsedUrl.searchParams.forEach((value, key) => {
        // this is passed with the prisma url, ignore it
        if (key === 'sslaccept') {
            return
        }
        try {
            // Try to parse this as a JSON expression first
            options[key] = JSON.parse(value)
        } catch (err) {
            // Otherwise assume it is a plain string
            options[key] = value
        }
    })
    return options
}

