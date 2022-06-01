import { generatorHandler, GeneratorOptions } from '@prisma/generator-helper'
import { logger } from '@prisma/sdk'
import path from 'path'
import fs from 'fs'
import { GENERATOR_NAME } from './constants'
import { transformDMMF } from './transformDMMF'

const { version } = require('../package.json')

generatorHandler({
    onManifest(config) {
        // config.config
        logger.info(`${GENERATOR_NAME}:Registered`)
        return {
            version,
            defaultOutput: './generated',
            prettyName: GENERATOR_NAME,
        }
    },
    onGenerate: async (options: GeneratorOptions) => {
        const code = transformDMMF(options.dmmf, options.generator.config)
        if (options.generator.output) {
            // console.log(options.generator.output)
            const outputDir: string = options.generator.output?.value as any
            try {
                await fs.promises.mkdir(outputDir, {
                    recursive: true,
                })
                await fs.promises.writeFile(
                    path.join(outputDir, 'types.ts'),
                    code as string,
                )
            } catch (e) {
                console.error(
                    'Error: unable to write files for Prisma Schema Generator',
                )
                throw e
            }
        } else {
            throw new Error(
                'No output was specified for Prisma Schema Generator',
            )
        }
    },
})
