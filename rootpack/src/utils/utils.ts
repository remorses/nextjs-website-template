import { useTheme } from 'next-themes'
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
