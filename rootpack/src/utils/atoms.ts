import { atom } from 'jotai'
import { Domain } from 'db'
export const atomUpgradeModal = atom({
    isOpen: false,
    siteId: '',
    reason: 'use this feature',
})

export const atomDomainModal = atom<{
    isOpen?: boolean
    domain?: Domain
    title?: string
}>({
    isOpen: false,
    domain: null,
    title: '',
})
