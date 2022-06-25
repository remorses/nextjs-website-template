import { NextFetchEvent, NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { decode } from 'next-auth/jwt'

const secret = process.env.SECRET
if (!secret) {
    throw new Error('SECRET is required')
}

export default async function middleware(req: NextRequest, ev: NextFetchEvent) {
    try {
        if (['/', '/org'].includes(req.nextUrl.pathname)) {
            const jwt = await getToken({
                req: req,

                // cookieName: nextAuthOptions?.cookies?.sessionToken?.name,
                secret,
            })
            
            if (jwt && jwt.defaultOrgId) {
                return NextResponse.redirect(
                    new URL(
                        `/org/${jwt.defaultOrgId}`,
                        req.nextUrl.origin,
                    ).toString(),
                )
            }
        }
    } catch (e) {}
}
