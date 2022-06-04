import { NextApiRequest } from 'next'
import { DefaultSession, ISODateString, Session } from 'next-auth'
import { JWT, DefaultJWT } from 'next-auth/jwt'

export interface AppNextApiRequest extends NextApiRequest {
    session?: Session & {
        userId?: string
    }
}

declare module 'next-auth' {
    interface Session {
        jwt: JWT
        user: {
            id: string
        } & DefaultSession['user']
        expires: ISODateString
    }
}

declare module 'next-auth/jwt' {
    interface JWT extends DefaultJWT {
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
