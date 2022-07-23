import { useTheme } from 'next-themes'
import router from 'next/router'
import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'

export {}

export function validateUrl(x: string) {
    if (!x.startsWith('http://') && !x.startsWith('https://')) {
        return 'Must be an url'
    }
    try {
        const url = new URL(x)
        if (url.pathname && url.pathname !== '/') {
            return 'Must not have path'
        }
    } catch {
        return 'Invalid url'
    }
}

export function refreshSsr() {
    return router.replace(router.asPath, router.asPath, { scroll: false })
}

export function nDaysAgo(n: number) {
    const d = new Date()
    d.setDate(d.getDate() - n)
    return d
}
