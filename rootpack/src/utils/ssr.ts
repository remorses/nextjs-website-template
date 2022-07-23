import { env as env } from '@app/env'
import { getToken, JWT } from 'next-auth/jwt'
import { AppError, KnownError } from '@app/utils/errors'
import { WrapMethod } from 'next-rpc'
import { options } from '@app/pages/api/auth/[...nextauth]'
import {
    GetServerSidePropsContext,
    GetServerSidePropsResult,
    GetServerSideProps,
} from 'next'
import { Session, unstable_getServerSession } from 'next-auth'
import { notifyError } from './bugsnag'

export async function getJwt({ req }: { req }): Promise<JWT> {
    const jwt = await getToken({ req, secret: env.SECRET })
    if (!jwt || !jwt.userId) {
        throw new AppError('Forbidden')
    }

    return jwt
}

export function requiresAuth<P>(
    handler: (
        context: GetServerSidePropsContext<any>,
        session: Session,
    ) => Promise<GetServerSidePropsResult<P>>,
): GetServerSideProps<P> {
    return wrapGetSSR(async function wrapperHandler(
        ctx: GetServerSidePropsContext<any>,
    ) {
        const session = await unstable_getServerSession(
            ctx.req,
            ctx.res,
            options,
        )
        if (!session || !session.jwt) {
            return {
                redirect: {
                    statusCode: 307,
                    destination: '/',
                },
            }
        }
        return handler(ctx, session)
    }) as any
}

export function wrapGetSSR(fn) {
    return async function wrappedFunction(ctx: GetServerSidePropsContext<any>) {
        try {
            return await fn(ctx)
        } catch (e) {
            if (e instanceof KnownError) {
                throw e
            }

            await notifyError(e, `api ${ctx?.req?.url}`)
            throw e
        }
    }
}
