import { generatorHandler, GeneratorOptions } from '@prisma/generator-helper'
import { logger } from '@prisma/sdk'
import path from 'path'
import fs from 'fs'
import { GENERATOR_NAME } from './constants'
import { transformDMMF } from './transformDMMF'

const { version } = require('../package.json')

import { inferSchema, inferTable } from 'mysql-schema-ts'

const prefix = 'Sql'

generatorHandler({
    onManifest(config) {
        // config.config
        logger.info(`${GENERATOR_NAME}:Registered`)
        return {
            version,
            defaultOutput: './kysely-client',
            prettyName: GENERATOR_NAME,
        }
    },
    onGenerate: async (options: GeneratorOptions) => {
        const out = path.resolve(options.generator.output?.value as any)
        await fs.promises.mkdir(out, { recursive: true })
        const DATABASE_URL = options.datasources.find(
            (x) => x.provider === 'mysql',
        )!.url.value
        if (!DATABASE_URL) {
            throw new Error(`Only works with mysql for now`)
        }
        const url = new URL(DATABASE_URL)
        url.searchParams.delete('sslaccept')
        // url.searchParams.set('ssl', '{"rejectUnauthorized":true}')
        const code = await inferSchema(url.toString(), prefix)
        fs.writeFileSync(path.resolve(out, './generated.ts'), code)
        fs.writeFileSync(path.resolve(out, './client.ts'), mainCode(options))
        console.log('Finished generating types')
        return
    },
})

const mainCode = (options: GeneratorOptions) => `
import { Kysely, MysqlDialect } from 'kysely'
import { createPool } from 'mysql2'

import * as types from './generated'

export * from './generated'

interface Database {
   ${options.dmmf.datamodel.models
       .map((x) => x.name + ': ' + 'types.' + prefix + x.name)
       .join(',\n    ')}
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

`
