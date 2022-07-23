import { env } from '@app/env'
import { nDaysAgo } from '@app/utils'
import { wrapMethod } from '@app/utils/bugsnag'
import { KnownError } from '@app/utils/errors'
import { getSiteLimits, getJwt } from '@app/utils/ssr'
import { getContext } from 'next-rpc/context'
import { prisma } from 'db'
// import { getPlanConfig } from 'prisma-client/src'
import * as uuid from 'uuid'

export const config = { rpc: true, wrapMethod } // enable rpc on this API route

export async function createInviteLink({ siteId }) {
    const { req, res } = getContext()
    const { userId } = await getJwt({ req })

    const site = await prisma.site.findFirst({
        where: { id: siteId, users: { some: { userId, role: 'ADMIN' } } },
    })
    if (!site) {
        throw new KnownError(`You are not admin of this site`)
    }
    const { sub, limits } = await getSiteLimits(site.id)

    if (!limits?.maxUsersNumber) {
        throw new KnownError(
            `You need an higher subscription plan to invite users`,
        )
    }
    const key = uuid.v4().replace(/-/g, '')
    await prisma.siteInviteLink.create({
        data: { key, siteId },
    })
    const host =
        process.env.NODE_ENV === 'development'
            ? 'http://localhost:3000'
            : env.NEXTAUTH_URL
    return { url: `${host}/invitation/${key}` }
}

export async function removeUserFromSite({ siteId, userToRemove }) {
    const { req, res } = getContext()
    const { userId } = await getJwt({ req })
    const isAdmin = await prisma.sitesUsers.findFirst({
        where: { siteId, userId, role: 'ADMIN' },
    })
    if (!isAdmin && userId !== userToRemove) {
        throw new KnownError(`You are not admin of this site`)
    }
    const isRemovedAdmin = await prisma.sitesUsers.findFirst({
        where: { siteId, userId: userToRemove, role: 'ADMIN' },
    })
    if (isRemovedAdmin) {
        throw new KnownError(`You cannot remove admin`)
    }

    await prisma.site.update({
        where: { id: siteId },
        data: {
            users: {
                delete: {
                    userId_siteId: {
                        userId: userToRemove,
                        siteId,
                    },
                },
            },
        },
    })
}

export async function acceptSiteInvitation({ key }) {
    if (!key) {
        throw new KnownError(`key is required`)
    }
    const { req, res } = getContext()
    const { userId } = await getJwt({ req })
    const maxDays = 1
    const invite = await prisma.siteInviteLink.findFirst({
        where: {
            key,
            createdAt: {
                gt: nDaysAgo(maxDays),
            },
        },
    })
    if (!invite) {
        throw new KnownError(`Invalid invite link`)
    }
    const users = await prisma.sitesUsers.findMany({
        where: { siteId: invite.siteId },
    })
    if (users.find((x) => x.userId === userId)) {
        throw new KnownError(`You are already part of this site`)
    }
    const { sub, limits } = await getSiteLimits(invite.siteId)
    if (
        limits?.maxUsersNumber != null &&
        users.length >= limits?.maxUsersNumber
    ) {
        throw new KnownError(
            `Max number of users reached: ${limits?.maxUsersNumber}`,
        )
    }
    await prisma.site.update({
        where: { id: invite.siteId },
        data: {
            users: {
                connectOrCreate: {
                    where: { userId_siteId: { siteId: invite.siteId, userId } },
                    create: { role: 'GUEST', userId },
                },
            },
        },
    })
    return invite
}
