import { nDaysAgo, partition } from '@app/utils'
import { prisma } from 'db'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    const since = req.body.since
    const sites = await prisma.site.findMany({
        where: {
            updatedAt: since
                ? {
                      gt: new Date(since),
                  }
                : undefined,
        },
        include: {
            routes: {
                select: {
                    basePath: true,
                    targetUrl: true,
                },
            },
            domains: {
                select: {
                    host: true,
                    domainType: true,
                },
            },
        },
        orderBy: {
            updatedAt: 'desc',
        },
    })
    const Map: GoConfig['Map'] = {}
    const Domains: GoConfig['Domains'] = {}
    for (const site of sites) {
        const { routes, domains } = site

        const [internalDomains, externalDomains] = partition(
            domains,
            (x) => x.domainType === 'customDomain',
        )
        const internalDomain = internalDomains[0]
        for (let dom of externalDomains) {
            Domains[dom.host] = internalDomain.host
        }
        let [fallbackRoutes, otherRoutes] = partition(
            routes,
            (x) => x.basePath === '/',
        )
        let fallbackRoute = fallbackRoutes[0]
        const Routes: HostConfig['Routes'] = Object.fromEntries(
            otherRoutes.map((route) => {
                return [route.basePath, { Target: route.targetUrl }]
            }),
        )
        Map[internalDomain.host] = {
            Routes,
            Fallback: fallbackRoute.targetUrl,
        }
    }
    const Since = sites[0].updatedAt.toISOString()
    const config = { Map, Domains, Since }
    res.status(200).json(config)
}

export type PathConfig = {
    BasePath?: string
    Target: string
}

export type HostConfig = {
    Routes: { [key: string]: PathConfig }
    Fallback: string
}

// TODO import this type from go package
export type GoConfig = {
    Map: { [key: string]: HostConfig }
    Domains: Record<string, string>
    Since: string
}
