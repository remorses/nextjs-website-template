import path from 'path'

const requiredSSR = [
    // 'NEXTAUTH_URL',
    // 'SECRET',
    // 'GOOGLE_ID',
    // 'GOOGLE_SECRET',
] as const

const required = [] as const

type keys = typeof requiredSSR[number] | typeof required[number]
export const env: { [p in keys]: string } = {
    ...process.env,
} as any

if (typeof window === 'undefined') {
    for (const k of requiredSSR) {
        if (!env[k]) {
            throw new Error(`Missing required ssr env var '${k}'`)
        }
    }
}

for (const k of required) {
    if (!env[k]) {
        throw new Error(`Missing required env var '${k}'`)
    }
}

// conf.TWITTER_CLIENT_ID
