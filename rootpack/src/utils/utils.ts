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

export async function fetchWithTimeout(
    resource,
    { timeout = 2000, ...options }: RequestInit & { timeout?: number } = {},
) {
    const controller = new AbortController()
    const id = setTimeout(() => controller.abort(), timeout)
    const response = await fetch(resource, {
        ...options,
        signal: controller.signal,
    })
    clearTimeout(id)
    return response
}

export function partition<T>(arr: T[], key: (x: T) => boolean) {
    const a = [] as T[]
    const b = [] as T[]
    for (const x of arr) {
        if (key(x)) {
            a.push(x)
        } else {
            b.push(x)
        }
    }
    return [a, b]
}
