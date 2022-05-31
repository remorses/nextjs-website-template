import { NextApiRequest } from 'next'
import { DefaultSession, ISODateString, Session } from 'next-auth'
import { JWT, DefaultJWT } from 'next-auth/jwt'

export interface AppNextApiRequest extends NextApiRequest {
    session?: Session & {
        userId?: string
    }
}

declare module 'next-auth' {
    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface Session {
        jwt: JWT
        user: {
            /** The user's postal address. */
            id: string
        } & DefaultSession['user']
        expires: ISODateString
    }
}

declare module 'next-auth/jwt' {
    /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
    interface JWT extends DefaultJWT {
        /** OpenID ID Token */
        userId: string
        isNewUser?: boolean
    }
}

declare global {
    const Paddle: any
    interface Window {
        loginForTests: ({ name, email }) => Promise<any>
    }
}

declare module 'react' {
    interface StyleHTMLAttributes<T> extends HTMLAttributes<T> {
        jsx?: boolean
        global?: boolean
    }
}
