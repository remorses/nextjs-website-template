import { Org } from 'prisma-client'
import { proxy, subscribe } from 'valtio'

const isBrowser = typeof window !== 'undefined'

export const currentlySelectedOrg = proxy<Org | undefined>()
