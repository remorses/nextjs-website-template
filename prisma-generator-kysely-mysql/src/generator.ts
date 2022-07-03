import { generatorHandler, GeneratorOptions } from '@prisma/generator-helper'
import { logger } from '@prisma/sdk'
import path from 'path'
import fs from 'fs'
import { GENERATOR_NAME } from './constants'
import { transformDMMF } from './transformDMMF'

const { version } = require('../package.json')

import { inferSchema, inferSchemaObject } from 'mysql-schema-ts'

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
            throw new Error(`Prisma generator only works with mysql for now`)
        }
        const url = new URL(DATABASE_URL)
        url.searchParams.delete('sslaccept')
        // url.searchParams.set('ssl', '{"rejectUnauthorized":true}')
        const code = await inferSchema(url.toString(), prefix)
        const obj = await inferSchemaObject(url.toString())
        fs.writeFileSync(path.resolve(out, './generated.ts'), code)
        fs.writeFileSync(
            path.resolve(out, './client.ts'),
            mainCode(obj.map((x) => x.name)),
        )
        console.log('Finished generating types')
        return
    },
})

const mainCode = (tables: string[]) => `
import { Kysely, MysqlDialect } from 'kysely'
import { createPool } from 'mysql2'

import * as types from './generated'

export * from './generated'

export interface DatabaseTables {
   ${tables.map((x) => x + ': ' + 'types.' + prefix + x).join(',\n    ')}
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

`
