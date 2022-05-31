import { env as env } from '@app/env'
import { getToken, JWT } from 'next-auth/jwt'
import { AppError } from '@app/utils'

// import { AppError } from '..'

export function getNotionRedirectUri() {
    const callback = new URL(
        `/api/notion/callback`,
        env.NEXTAUTH_URL,
    ).toString()
    return callback
}

export async function getJwt({ req }: { req }): Promise<JWT> {
    const jwt = await getToken({ req, secret: process.env.SECRET })
    if (!jwt || !jwt.userId) {
        throw new AppError('Forbidden')
    }

    return jwt
}
