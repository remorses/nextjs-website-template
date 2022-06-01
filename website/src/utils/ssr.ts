import { env as env } from '@app/env'
import { getToken, JWT } from 'next-auth/jwt'
import { AppError } from '@app/utils'

export async function getJwt({ req }: { req }): Promise<JWT> {
    const jwt = await getToken({ req, secret: env.SECRET })
    if (!jwt || !jwt.userId) {
        throw new AppError('Forbidden')
    }

    return jwt
}
