import path from 'path'

export const env = {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    SECRET: process.env.SECRET,
    GOOGLE_ID: process.env.GOOGLE_ID,
    GOOGLE_SECRET: process.env.GOOGLE_SECRET,
}

if (typeof window === 'undefined') {
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
