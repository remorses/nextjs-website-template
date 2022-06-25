import { env } from '@app/env'
import NextAuth, { NextAuthOptions, User } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import { Adapter } from 'next-auth/adapters'
import { KnownError } from '@app/utils'

const adapter = KyselyAdapter()

export const nextAuthOptions: NextAuthOptions = {
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
            if (typeof user?.defaultOrgId === 'string') {
                token.defaultOrgId = user.defaultOrgId
            }

            return token
        },
    },
}

import { db, SqlUser } from 'db'
import cuid from 'cuid'

export function KyselyAdapter(): Adapter {
    const notImplemented: any = () => {
        throw new Error('not implemented')
    }
    const adapter: Adapter = {
        // async createUser(data): Promise<any> {
        //     console.info(`createUser`)
        //     const row = {
        //         ...data,
        //         id: cuid(),
        //     }
        //     await db.insertInto('User').values(row).executeTakeFirst()
        //     return row
        // },
        async createUser(data): Promise<any> {
            const defaultOrgName = getDefaultOrgNameFromUser(data)
            console.info(`createUser`)

            const row = await db.transaction().execute(async (trx) => {
                const orgId = cuid()
                await trx
                    .insertInto('Org')
                    .values({ name: defaultOrgName, id: orgId })
                    .executeTakeFirst()
                const row: SqlUser = {
                    ...data,
                    id: cuid(),
                    defaultOrgId: orgId,
                }
                await trx.insertInto('User').values(row).executeTakeFirst()

                await trx
                    .insertInto('OrgsUsers')
                    .values({ orgId, userId: row.id, role: 'admin' })
                    .executeTakeFirst()
                return row
            })
            return row
        },
        getUser: async (id): Promise<any> => {
            const res = await db
                .selectFrom('User')
                .where('id', '=', id)
                .selectAll()
                .executeTakeFirst()
            console.info(`getUser`, res)
            return res
        },
        getUserByEmail: async (email): Promise<any> => {
            const res = await db
                .selectFrom('User')
                .where('email', '=', email)
                .selectAll()
                .executeTakeFirst()
            console.info(`getUserByEmail`, res)
            return res
        },

        async getUserByAccount(provider_providerAccountId): Promise<any> {
            const user = await db
                .selectFrom('Account')
                .where(
                    'Account.providerAccountId',
                    '=',
                    provider_providerAccountId.providerAccountId,
                )
                .where(
                    'Account.provider',
                    '=',
                    provider_providerAccountId.provider,
                )
                .innerJoin('User', 'User.id', 'Account.userId')
                .selectAll('User')
                .executeTakeFirst()
            console.info(`getUserByAccount`, user)
            return user
        },
        async updateUser(data): Promise<any> {
            console.info(`updateUser`)
            const user = await db
                .updateTable('User')
                .where('id', '=', data.id)
                .set(data)
                .executeTakeFirst()

            return await adapter.getUser(data.id)
        },
        async deleteUser(id): Promise<any> {
            console.info(`deleteUser`)
            const user = await db
                .deleteFrom('User')

                .where('id', '=', id)
                .executeTakeFirst()

            return
        },

        async linkAccount(account) {
            console.info(`linkAccount`)
            const res = await db
                .insertInto('Account')
                .values({ ...account, id: cuid() })
                .executeTakeFirst()
            return account
        },
        async unlinkAccount(provider_providerAccountId) {
            console.info(`unlinkAccount`)
            const res = await db
                .deleteFrom('Account')
                .where('provider', '=', provider_providerAccountId.provider)
                .where(
                    'providerAccountId',
                    '=',
                    provider_providerAccountId.providerAccountId,
                )
                .executeTakeFirst()
            return
        },
        getSessionAndUser: notImplemented,
        createSession: notImplemented,
        updateSession: notImplemented,
        deleteSession: notImplemented,
        createVerificationToken: notImplemented,
        useVerificationToken: notImplemented,
    }
    return adapter
}
function getDefaultOrgNameFromUser(user: Partial<User>) {
    return user.name
}

export default NextAuth(nextAuthOptions)
