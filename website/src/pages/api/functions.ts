export const config = { rpc: true } // enable rpc on this API route
import { getContext } from 'next-rpc/context'
import { getJwt } from '@app/utils/ssr'
import { KnownError } from '@app/utils'
import { BeskarContext } from 'beskar/landing'

export async function example({}) {
    const { req, res } = getContext()
}

export const getUserOrgs: BeskarContext['getUserOrgs'] = async () => {
    // const { req } = getContext()
    return {
        defaultOrgId: 'xxx',
        orgs: [
            { id: 'xxx', name: 'xxx' },
            { id: 'yyy', name: 'some-other-org' },
        ],
    }
    // const { userId, defaultOrgId } = await getJwt({ req })

    // const orgs = await db
    //     .selectFrom('Org')
    //     .where('Org.id', 'in', (q) =>
    //         q
    //             .selectFrom('OrgsUsers')
    //             .where('OrgsUsers.userId', '=', userId)

    //             .select('OrgsUsers.orgId'),
    //     )
    //     .select(['Org.name', 'Org.id'])
    //     .execute()
    // // console.log({ orgs })
    // return { defaultOrgId, orgs: orgs }
}

export const createOrg: BeskarContext['createOrg'] = async ({ name = '' }) => {
    if (!name) {
        throw new KnownError(`Name is required`)
    }
    if (!/^[a-zA-Z0-9]+$/i.test(name)) {
        throw new KnownError(`Name can have only letters and numbers: ${name}`)
    }

    // const { req } = getContext()
    // const { userId } = await getJwt({ req })
    // const org: SqlOrg = { name, id: cuid() }
    // await db.insertInto('Org').values(org).executeTakeFirst()
    // await db
    //     .insertInto('OrgsUsers')
    //     .values({ orgId: org.id, userId, role: 'admin' })
    //     .executeTakeFirst()
    // return org
}
