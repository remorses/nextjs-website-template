import { env } from '@app/env'
import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import { Adapter } from 'next-auth/adapters'
import { KnownError } from '@app/utils'

const adapter = PrismaAdapter({} as any)

export default NextAuth({
    // Configure one or more authentication providers
    providers: [
        process.env.NODE_ENV !== 'production' &&
            CredentialsProvider({
                id: 'test-provider',
                name: 'test-provider',
                credentials: {
                    email: { type: 'text' },
                    name: { type: 'text' },
                },
                // This is where all the logic goes
                authorize: async (credentials) => {
                    // If the request went well, we received all this info from Google.
                    const { email, name } = credentials
                    if (!email) {
                        throw new KnownError(
                            'Email is required for test provider',
                        )
                    }

                    // Let's check on our DB if the user exists
                    let user = await adapter.getUserByEmail(email)

                    // If there's no user, we need to create it
                    if (!user) {
                        if (!name) {
                            throw new KnownError(
                                'User does not exist, name is require',
                            )
                        }
                        user = await adapter.createUser({
                            name,
                            email,
                        })
                    }

                    return user
                },
            }),
        GoogleProvider({
            clientId: env.GOOGLE_ID!,
            clientSecret: env.GOOGLE_SECRET!,
        }),
    ],
    adapter: adapter as any,
    jwt: {
        secret: env.SECRET,
    },
    session: {
        strategy: 'jwt',
    },
    secret: env.SECRET,

    callbacks: {
        async session({ session, token }) {
            session.user.id = token.userId
            session.jwt = token
            return session
        },

        async jwt({ token, account, isNewUser, user, profile }) {
            // add user orgs to the jwt? this way the api can skip making a request to the db maybe?
            // jwt happens before session, it has access to many provider stuff on first sign up
            // console.log('jwt', { token, account, isNewUser, user, profile })
            if (user) {
                token.userId = user.id
            }
            if (isNewUser) {
                token.isNewUser = true
            }
            return token
        },
    },
})

export function PrismaAdapter(prisma: PrismaClient): Partial<Adapter> {
    return {
        async createUser(data) {
            const user = await prisma.user.create({ data })
            // create default org for user
            await prisma.orgsUsers.create({
                data: {
                    role: 'admin',
                    // userId: user.id,
                    user: {
                        connect: {
                            id: user.id,
                        },
                    },
                    org: {
                        create: {
                            name: user.name || 'default',
                        },
                    },
                },
            })
            return user
        },
        getUser(id) {
            return prisma.user.findUnique({ where: { id } })
        },
        getUserByEmail(email) {
            return prisma.user.findUnique({ where: { email } })
        },
        async getUserByAccount(provider_providerAccountId) {
            const account = await prisma.account.findUnique({
                where: { provider_providerAccountId },
                select: { user: true },
            })
            return account?.user ?? null
        },
        updateUser(data) {
            return prisma.user.update({ where: { id: data.id }, data })
        },
        deleteUser(id) {
            return prisma.user.delete({ where: { id } })
        },
        async linkAccount(data) {
            // console.log('account', pretty(data))
            const res = (await prisma.account.create({ data })) as any // TODO fix next-auth linkAccount return type on next auth
            return res
        },
        unlinkAccount(provider_providerAccountId) {
            return prisma.account.delete({
                where: { provider_providerAccountId },
            }) as any
        },
        // async getSessionAndUser(sessionToken) {
        //     const userAndSession = await prisma.session.findUnique({
        //         where: { sessionToken },
        //         include: { user: true },
        //     })
        //     if (!userAndSession) return null
        //     const { user, ...session } = userAndSession
        //     return { user, session }
        // },
        // createSession: (data) => prisma.session.create({ data }),
        // updateSession: (data) =>
        //     prisma.session.update({
        //         data,
        //         where: { sessionToken: data.sessionToken },
        //     }),
        // deleteSession: (sessionToken) =>
        //     prisma.session.delete({ where: { sessionToken } }),
        createVerificationToken(data) {
            return prisma.verificationToken.create({ data })
        },
        async useVerificationToken(identifier_token) {
            try {
                return await prisma.verificationToken.delete({
                    where: { identifier_token },
                })
            } catch (error) {
                // If token already used/deleted, just return null
                // https://www.prisma.io/docs/reference/api-reference/error-reference#p2025
                if (
                    (error as Prisma.PrismaClientKnownRequestError).code ===
                    'P2025'
                )
                    return null
                throw error
            }
        },
    }
}
