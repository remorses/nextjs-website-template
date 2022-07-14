// export * from './kysely-client/client'

import { PrismaClient } from '@prisma/client'
export * from '@prisma/client'

const debugQueries = false

// https://www.prisma.io/docs/support/help-articles/nextjs-prisma-client-dev-practices
export const prisma: PrismaClient =
    (global as any).prisma ||
    new PrismaClient({
        log:
            process.env.NODE_ENV === 'development' && debugQueries
                ? [
                      {
                          emit: 'stdout',
                          level: 'query',
                      },
                  ]
                : undefined,
    })

if (process.env.NODE_ENV !== 'production') (global as any).prisma = prisma
