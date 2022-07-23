import { NextFetchEvent, NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { decode } from 'next-auth/jwt'
import { env } from './env'

const secret = env.SECRET
if (!secret) {
    throw new Error('SECRET is required')
}

export default async function middleware(req: NextRequest, ev: NextFetchEvent) {
    try {
        let pathname = req.nextUrl.pathname

        if (pathname.startsWith('/site/')) {
            const jwt = await getToken({
                req: req,
                // cookieName: nextAuthOptions?.cookies?.sessionToken?.name,
                secret,
            })
            if (!jwt) {
                return NextResponse.redirect(new URL(`/`, req.nextUrl.origin))
            }
        }
        if (pathname === '/') {
            const jwt = await getToken({
                req: req,
                // cookieName: nextAuthOptions?.cookies?.sessionToken?.name,
                secret,
            })
            const defaultSiteId = jwt?.defaultSiteId
            if (defaultSiteId) {
                return NextResponse.redirect(
                    new URL(`/site/${defaultSiteId}`, req.nextUrl.origin),
                )
            }
            if (jwt && !defaultSiteId) {
                return NextResponse.redirect(
                    new URL(`/new`, req.nextUrl.origin),
                )
            }
        }
    } catch (e) {}
}
