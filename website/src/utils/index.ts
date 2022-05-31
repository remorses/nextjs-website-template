import { useTheme } from 'next-themes'
import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'

export function useColorMode() {
    const { resolvedTheme: _resolvedTheme, setTheme } = useTheme()
    function toggleColorMode() {
        setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
    }
    const [resolvedTheme, setResolvedTheme] = useState(() => {
        return 'light'
    })

    useEffect(() => {
        setResolvedTheme(_resolvedTheme)
    }, [_resolvedTheme])
    return {
        toggleColorMode,
        colorMode: resolvedTheme,
        isDark: resolvedTheme === 'dark',
    }
}
export function useColorModeValue(a, b) {
    const { isDark } = useColorMode()

    return isDark ? b : a
}

export class KnownError extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'KnownError'
    }
}
export class AppError extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'AppError'
    }
}

export function useThrowingFn({
    fn: fnToWrap,
    successMessage = '',
    errorMessage = 'Error',
}) {
    const [isLoading, setIsLoading] = useState(false)
    const fn = async function wrappedThrowingFn(...args) {
        try {
            setIsLoading(true)
            const result = await fnToWrap(...args)
            if (successMessage) {
                toast.success(`Success!\n\n${successMessage}`)
            }
            return result
        } catch (err) {
            toast.error(`${errorMessage}:\n\n${err.message}`, {})

            console.error(err)
        } finally {
            setIsLoading(false)
        }
    }
    return {
        isLoading,
        fn,
    }
}
