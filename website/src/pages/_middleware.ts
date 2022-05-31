import { NextFetchEvent, NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(req: NextRequest, ev: NextFetchEvent) {
    try {
        if (['/', '/org'].includes(req.nextUrl.pathname)) {
            const jwt = await getToken({
                req: req as any,
                secret: process.env.SECRET,
            })
            // console.log(jwt, req.nextUrl.pathname)
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
