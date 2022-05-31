import { prisma, ScrapedTweet } from 'prisma-client'
export const config = { rpc: true } // enable rpc on this API route
import { getContext } from 'next-rpc/context'
import { getJwt } from '@app/utils/ssr'
import { KnownError } from '@app/utils'

export async function example({}) {
    const { req, res } = getContext()
}
