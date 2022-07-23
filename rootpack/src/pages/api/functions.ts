import { getContext } from 'next-rpc/context'
import isValidDomain from 'is-valid-domain'
import { getJwt, getSiteLimits } from '@app/utils/ssr'
import { AppError, KnownError } from '@app/utils/errors'
import { BeskarContext } from 'beskar/landing'
// import { db, SqlOrg } from 'db/kysely'
import cuid from 'cuid'
import { wrapMethod } from '@app/utils/bugsnag'
import { prisma, Route } from 'db'
import { env } from '@app/env'
import { validSubscriptionFilter } from 'db/data'

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

    const users = await prisma.sitesUsers.findMany({
        where: {
            siteId,
            userId,
            // role: 'ADMIN',
        },
    })
    if (users.find((x) => x.role === 'ADMIN')?.userId !== userId) {
        throw new KnownError(`You are not admin of this site`)
    }
    // TODO what to do with defaultSiteId?
    // await prisma.user.updateMany({
    //     where: { id: { in: users.map((x) => x.userId) } },
    //     data: {
    //         defaultSiteId: '',
    //     },
    // })
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

export const deleteCustomDomain = async function deleteCustomDomain({
    domainId,
    siteId,
}: {
    domainId: string
    siteId: string
}) {
    if (!domainId) {
        throw new KnownError(`domainId is required`)
    }
    const { req, res } = getContext()
    const { userId } = await getJwt({ req })

    const domain = await prisma.domain.findFirst({
        where: {
            id: domainId,
            site: { id: siteId, users: { some: { userId } } },
            domainType: 'customDomain',
        },
    })

    if (!domain) {
        throw new AppError(`Cannot find custom domain to delete ${domainId}`)
    }
    try {
        // TODO remove domain from fly.io
    } catch (e) {
        console.error(e)
        throw new AppError(`Cannot delete domain on Vercel: ${e?.message}`)
    }
    const result = await prisma.domain.deleteMany({
        where: {
            id: domainId,
            site: { users: { some: { userId } } },
            domainType: 'customDomain',
        }, // user cannot delete default domain
    })

    // mark site to be refetched by proxy
    await prisma.site.update({
        where: { id: siteId },
        data: {
            updatedAt: new Date(),
        },
    })

    if (result.count === 0) {
        throw new AppError(`Domain not deleted`)
    }
}

export const getSubscription = async ({ siteId }) => {
    const { req, res } = getContext()
    const { userId } = await getJwt({ req })
    const { sub: subscription, limits } = await getSiteLimits(siteId)

    return { subscription }
}

export const getProducts = async ({} = {}) => {
    const isSandbox = Boolean(env.NEXT_PUBLIC_ENV !== 'production')
    const products = await prisma.product.findMany({
        where: {
            active: true,
            isSandbox,
        },
        include: {
            prices: true,
        },
    })

    return { products }
}

export async function createDomain({ siteId, host }) {
    if (!host) {
        throw new KnownError(`host is required`)
    }
    const { req, res } = getContext()
    const { userId } = await getJwt({ req })
    const site = await prisma.site.findFirst({
        where: {
            id: siteId,
            users: {
                some: { userId },
            },
        },
    })
    if (!site) {
        throw new KnownError(`Site not found`)
    }
    if (!isValidDomain(host)) {
        throw new KnownError(`Domain ${host} is not valid`)
    }
    if (host.endsWith(env.NEXT_PUBLIC_APPS_DOMAIN)) {
        throw new KnownError(`${env.NEXT_PUBLIC_APPS_DOMAIN} is reserved`)
    }
    const domain = await prisma.domain.findFirst({
        where: {
            host,
        },
    })
    if (domain) {
        throw new KnownError(`Domain ${host} already in use`)
    }
    // TODO create domain on fly.io
    const result = await prisma.domain.create({
        data: {
            host,
            siteId,
            domainType: 'customDomain',
        },
    })
    // mark site to be refetched by proxy
    await prisma.site.update({
        where: { id: siteId },
        data: {
            updatedAt: new Date(),
        },
    })
}

export async function updateDomain({ siteId, domainId, host }) {
    if (!host) {
        throw new KnownError(`host is required`)
    }
    const { req, res } = getContext()
    const { userId } = await getJwt({ req })
    const site = await prisma.site.findFirst({
        where: {
            id: siteId,
            users: {
                some: { userId },
            },
            domains: {
                some: { id: domainId },
            },
        },
    })
    if (!site) {
        throw new KnownError(`Site with domain not found`)
    }
    if (!isValidDomain(host)) {
        throw new KnownError(`Domain ${host} is not valid`)
    }
    const internal = host.endsWith(env.NEXT_PUBLIC_APPS_DOMAIN)

    // TODO update domain on fly.io
    const result = await prisma.domain.update({
        where: {
            id: domainId,
        },
        data: {
            host,
            domainType: internal ? 'internalDomain' : 'customDomain',
        },
    })
    // mark site to be refetched by proxy
    await prisma.site.update({
        where: { id: siteId },
        data: {
            updatedAt: new Date(),
        },
    })
}

export async function createNewRoute({
    basePath,
    siteId,
    targetUrl,
}: Partial<Route>) {
    const { req, res } = getContext()
    const { userId } = await getJwt({ req })
    if (!basePath) {
        throw new KnownError(`basePath is required`)
    }
    if (!siteId) {
        throw new KnownError(`siteId is required`)
    }
    if (!targetUrl) {
        throw new KnownError(`targetUrl is required`)
    }
    if (!/^[a-zA-Z0-9/]+$/i.test(basePath)) {
        throw new KnownError(
            `Path can have only letters and numbers: ${basePath}`,
        )
    }
    const site = await prisma.site.findFirst({
        where: {
            id: siteId,
            users: {
                some: { userId },
            },
        },
    })
    if (!site) {
        throw new KnownError(`Site not found`)
    }
    const route = await prisma.route.findFirst({
        where: {
            basePath,
            siteId,
        },
    })
    if (route) {
        throw new KnownError(`Route ${basePath} already exists`)
    }
    // mark site to be refetched by proxy
    await prisma.site.update({
        where: { id: siteId },
        data: {
            updatedAt: new Date(),
        },
    })
    await prisma.route.create({
        data: {
            basePath,
            targetUrl,
            siteId,
        },
    })
}

export async function deleteRoute({ routeId, siteId }) {
    const { req, res } = getContext()
    const { userId } = await getJwt({ req })

    if (!siteId) {
        throw new KnownError(`siteId is required`)
    }
    if (!routeId) {
        throw new KnownError(`routeId is required`)
    }

    const route = await prisma.route.findFirst({
        where: {
            id: routeId,
            site: {
                users: {
                    some: { userId },
                },
                routes: {
                    some: {
                        id: routeId,
                    },
                },
            },
        },
    })

    if (!route) {
        throw new KnownError(`Route not found`)
    }
    if (route.basePath === '/') {
        throw new KnownError(`Cannot delete root / route`)
    }
    // mark site to be refetched by proxy
    await prisma.site.update({
        where: { id: siteId },
        data: {
            updatedAt: new Date(),
        },
    })
    await prisma.route.delete({
        where: {
            id: routeId,
        },
    })
}

export async function deleteUser() {
    const { req, res } = getContext()
    const { userId } = await getJwt({ req })
    if (!userId) {
        return
    }

    const sitesWithSub = await prisma.site.findMany({
        where: {
            users: {
                some: { userId, role: 'ADMIN' },
            },
            subscriptions: {
                some: {
                    ...validSubscriptionFilter,
                },
            },
        },
    })
    if (sitesWithSub.length > 0) {
        throw new KnownError(
            `There are sites with subscriptions active. Cancel them first.`,
        )
    }

    await prisma.site.deleteMany({
        where: { users: { some: { userId, role: 'ADMIN' } } },
    })
    await prisma.user.delete({
        where: { id: userId },
    })

    return
}
