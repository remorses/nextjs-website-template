import path from 'path'

export const env = {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    SECRET: process.env.SECRET,
    NEXT_PUBLIC_ENV: process.env.NEXT_PUBLIC_ENV,
    GOOGLE_ID: process.env.GOOGLE_ID,
    GOOGLE_SECRET: process.env.GOOGLE_SECRET,
    NEXT_PUBLIC_APPS_DOMAIN: process.env.NEXT_PUBLIC_APPS_DOMAIN,
}

if (typeof process !== 'undefined') {
    for (const k in env) {
        if (!env[k]) {
            throw new Error(`Missing required ssr env var '${k}'`)
        }
    }
}

for (const k in env) {
    if (k.startsWith('NEXT_PUBLIC') && !env[k]) {
        throw new Error(`Missing required client env var '${k}'`)
    }
}

// conf.TWITTER_CLIENT_ID
