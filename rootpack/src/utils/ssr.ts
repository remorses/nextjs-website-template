import { env as env } from '@app/env'
import { getToken, JWT } from 'next-auth/jwt'
import { AppError, KnownError } from '@app/utils/errors'
import { WrapMethod } from 'next-rpc'
import { options } from '@app/pages/api/auth/[...nextauth]'
import {
    GetServerSidePropsContext,
    GetServerSidePropsResult,
    GetServerSideProps,
} from 'next'
import { Session, unstable_getServerSession } from 'next-auth'
import { notifyError } from './bugsnag'
import { prisma } from 'db'

export async function getJwt({ req }: { req }): Promise<JWT> {
    const jwt = await getToken({ req, secret: env.SECRET })
    if (!jwt || !jwt.userId) {
        throw new AppError('Forbidden')
    }

    return jwt
}

export function requiresAuth<P>(
    handler: (
        context: GetServerSidePropsContext<any>,
        session: Session,
    ) => Promise<GetServerSidePropsResult<P>>,
): GetServerSideProps<P> {
    return wrapGetSSR(async function wrapperHandler(
        ctx: GetServerSidePropsContext<any>,
    ) {
        const session = await unstable_getServerSession(
            ctx.req,
            ctx.res,
            options,
        )
        if (!session || !session.jwt) {
            return {
                redirect: {
                    statusCode: 307,
                    destination: '/',
                },
            }
        }
        return handler(ctx, session)
    }) as any
}

export function wrapGetSSR(fn) {
    return async function wrappedFunction(ctx: GetServerSidePropsContext<any>) {
        try {
            return await fn(ctx)
        } catch (e) {
            if (e instanceof KnownError) {
                throw e
            }

            await notifyError(e, `api ${ctx?.req?.url}`)
            throw e
        }
    }
}
import {
    mergePlanLimits,
    subscriptionSorter,
    validSubscriptionFilter,
} from 'db/data'

export async function getSiteLimits(siteId: string) {
    const subs = await prisma.subscription.findMany({
        where: { siteId, ...validSubscriptionFilter },
        orderBy: { updatedAt: 'desc' },
        include: {
            product: true,
        },
    })

    const sub = subs.sort(subscriptionSorter)?.[0]

    return { sub, limits: mergePlanLimits(subs.map((x) => x.productId)), subs }
}

export const redirectionOnNoSite = {
    redirect: {
        destination: '/board',
        permanent: false,
    },
}

const pricesCurrency = 'USD'
export async function getPricingProducts() {
    const isSandbox = Boolean(false) // TODO env.NEXT_PUBLIC_IS_PADDLE_SANDBOX)
    console.log('is paddle sandbox?', isSandbox)
    const products = await prisma.product.findMany({
        where: {
            active: true,
            isSandbox,
        },
        include: {
            prices: true,
        },
    })

    const freeProduct = {
        isSandbox,
        active: true,
        billing_period: 1,
        billing_type: 'month',
        name: 'Free',
        image: '',
        trial_days: 0,
        paddleId: 'free',
        createdAt: new Date(),
        updatedAt: new Date(),
        prices: [
            {
                isSandbox,
                paddleId: 'Free',
                currency: pricesCurrency,
                unitAmount: 0,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ],
    }
    const enterpriseProduct = {
        isSandbox,
        active: true,
        billing_period: 1,
        billing_type: 'month',
        name: 'Enterprise',
        image: '',
        trial_days: 0,
        paddleId: 'Enterprise',
        createdAt: new Date(),
        updatedAt: new Date(),
        prices: [
            {
                isSandbox,
                paddleId: 'Enterprise',
                currency: pricesCurrency,
                unitAmount: 2000 * 1000,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ],
    }

    products.push({ ...freeProduct, billing_type: 'month' })
    products.push({ ...freeProduct, billing_type: 'year' })
    products.push({ ...enterpriseProduct, billing_type: 'month' })
    products.push({ ...enterpriseProduct, billing_type: 'year' })
    return products
}
