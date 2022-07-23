import { Product, Subscription } from '@prisma/client'

export const validSubscriptionFilter = {
    OR: [
        {
            cancellation_effective_date: {
                gt: new Date(),
            },
        },
        {
            cancellation_effective_date: null,
        },
    ],
}

type PlanConfig = {
    name: string
    paddleId: string
    isLifetime?: boolean
    hidden?: boolean
    limits: Limits
}

export type Limits = {
    maxViews: number
    maxDomainsNumber: number
    maxUsersNumber: number
    canHidePoweredBy?: boolean
    canAddBackground: boolean
    canAddBanner: boolean
    // canInviteUsers?: boolean
}

export const limitNames: (keyof Limits)[] = [
    'canHidePoweredBy',
    'canAddBackground',
    'maxViews',
    'maxDomainsNumber',
    'maxUsersNumber',
    'canAddBanner',
]

export function betterLimitName(name: string): string {
    const mapper: Record<keyof Limits, string> = {
        canHidePoweredBy: '',
        maxViews: 'Max page views',
        maxDomainsNumber: 'Max domains number',
        maxUsersNumber: 'Max users per site',
        canAddBackground: 'Can add background',
        canAddBanner: 'Can add top banner',
    }
    return mapper[name]
}

let envVar = process.env.VERCEL_ENV
    ? process.env.VERCEL_ENV
    : process.env.NODE_ENV

const isDev = envVar !== 'production'

export const subscriptionPlansConfig: PlanConfig[] = [] // TODO add plans

export function subscriptionSorter(a: Subscription, b: Subscription) {
    const prodA = getPlanConfig({ paddleId: a.productId })
    const prodB = getPlanConfig({ paddleId: b.productId })
    if (prodA && prodB) {
        return prodB?.limits?.maxViews - prodA?.limits?.maxViews
    }
    return 0
}

export function getUsageWindowStartDate() {
    const now = new Date()
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
    return firstDay
}

export function getPlanConfig(p: { paddleId: string; isSandbox?: boolean }) {
    const productId = p?.paddleId
    const freePlan: PlanConfig = {
        name: 'free',
        paddleId: '',
        limits: {
            maxViews: 1000,
            maxDomainsNumber: 0,
            maxUsersNumber: 0,
            canHidePoweredBy: false,
            canAddBackground: false,
            canAddBanner: false,
        },
    }
    if (!productId) {
        return freePlan
    }
    const plan = subscriptionPlansConfig.find((p) => p.paddleId === productId)
    // if (productId && !plan && !p.isSandbox) {
    //     throw new Error(`No max page views found for plan ${productId}`)
    // }
    if (!plan) {
        return freePlan
    }

    return plan
}

// problem: if i create upsells for stuff like 1 more domain, i need to compute the sum of the numbers instead of taking the bigger one
// what if i always make the sum if one limit is a number?

// problem: if limits are connected to subscription every time i want to make users upsell i need to create new plans
// this makes sense if i want to increase prices
// this makes sense for lifetime deals after camp end

export function mergePlanLimits(productIds: string[]) {
    if (!productIds) {
        productIds = []
    }
    const limitsArr = productIds.map(
        (x) => getPlanConfig({ paddleId: x })?.limits,
    )
    // add free plan if no subscription
    limitsArr.push(getPlanConfig({ paddleId: '' })?.limits)

    const mergedLimits: Partial<Limits> = Object.fromEntries(
        limitNames.map((k) => {
            return [
                k,
                limitsArr
                    .map((x) => x[k])
                    // TODO instead of doing a sort, do a reduce
                    .reduce((a, b) => {
                        if (typeof a === 'number' && typeof b === 'number') {
                            return (a || 0) + (b || 0)
                        }
                        if (typeof a === 'boolean' || typeof b === 'boolean') {
                            return a || b
                        }
                        return a
                    }),
            ]
        }),
    )
    return mergedLimits
}
