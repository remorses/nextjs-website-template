import { getContext } from 'next-rpc/context'
import isValidDomain from 'is-valid-domain'
import { getJwt } from '@app/utils/ssr'
import { AppError, KnownError } from '@app/utils/errors'
import { BeskarContext } from 'beskar/landing'
// import { db, SqlOrg } from 'db/kysely'
import cuid from 'cuid'
import { wrapMethod } from '@app/utils/bugsnag'
import { prisma, Route } from 'db'
import { env } from '@app/env'

export const config = { rpc: true, wrapMethod } // enable rpc on this API route

export async function example({}) {
    const { req, res } = getContext()
}

export const getUserSites = async () => {
    const { req } = getContext()

    const { userId, defaultSiteId } = await getJwt({ req })

    const sites = await prisma.site.findMany({
        where: {
            users: {
                some: {
                    userId,
                },
            },
        },
    })

    return { sites: sites }
}
export const updateSite = async ({ name, siteId }) => {
    const { req } = getContext()

    const { userId } = await getJwt({ req })

    const sites = await prisma.site.updateMany({
        where: {
            id: siteId,
            users: {
                some: {
                    userId,
                },
            },
        },
        data: {
            name,
        },
    })

    return { sites: sites }
}
export const deleteSite = async ({ siteId }) => {
    const { req } = getContext()

    const { userId } = await getJwt({ req })

    const admin = await prisma.sitesUsers.findFirst({
        where: {
            siteId,
            userId,
            role: 'ADMIN',
        },
    })
    if (!admin) {
        throw new KnownError(`You are not admin of this site`)
    }
    const site = await prisma.site.delete({
        where: {
            id: siteId,
        },
    })

    return { sites: site }
}

export const createSite = async ({
    name = '',
    routes,
    setAsDefault = false,
}: {
    name: string
    routes: Partial<Route>[]
    setAsDefault?: boolean
}) => {
    if (!name) {
        throw new KnownError(`Name is required`)
    }
    // if (!/^[a-zA-Z0-9]+$/i.test(name)) {
    //     throw new KnownError(`Name can have only letters and numbers: ${name}`)
    // }

    const { req } = getContext()
    const { userId } = await getJwt({ req })

    const host = `${transformToValidDomain(name)}.${
        env.NEXT_PUBLIC_APPS_DOMAIN
    }`
    if (!isValidDomain(host)) {
        throw new AppError(
            `Choose another name from '${name}', domain ${host} is not valid`,
        )
    }
    const site = await prisma.site.create({
        data: {
            name,
            users: {
                create: {
                    userId,
                    role: 'ADMIN',
                },
            },
            domains: {
                create: {
                    host,
                    domainType: 'internalDomain',
                },
            },
            routes: {
                createMany: {
                    data: routes.map((x) => {
                        const { basePath, targetUrl } = x
                        return {
                            basePath,
                            targetUrl,
                        }
                    }),
                },
            },
        },
    })
    if (setAsDefault && site) {
        await prisma.user.update({
            where: { id: userId },
            data: { defaultSiteId: site.id },
        })
    }
    return site
}

function transformToValidDomain(name: string) {
    name = name
        .replace(/ /g, '')
        .replace(/\./g, '')
        .replace(/[^a-zA-Z0-9]/g, '')
        .toLowerCase()
    if (name) {
        name += '-'
    }
    return name + cuid().slice(-5)
}
