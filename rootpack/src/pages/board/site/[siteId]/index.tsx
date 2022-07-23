import {
    AdjustmentsIcon,
    BeakerIcon,
    ChevronRightIcon,
    CogIcon,
    CreditCardIcon,
    EmojiHappyIcon,
    FolderIcon,
    HomeIcon,
    LinkIcon,
} from '@heroicons/react/solid'
import { TabLink } from 'beskar/src/Tabs'
import { Alert, Block, SaveButton, TableBlock } from 'beskar/dashboard'
import { useRouter } from 'next/router'
import {
    redirectionOnNoSite as redirectionOnNoSite,
    requiresAuth,
} from '@app/utils/ssr'
import { prisma, Route } from 'db'
import { InferGetServerSidePropsType } from 'next/types'
import { Fragment, useState } from 'react'
import {
    Button,
    InlineCode,
    Link,
    useDisclosure,
    useThrowingFn,
} from 'beskar/landing'
import { RouteModal } from '@app/components/RouteModal'
import classNames from 'classnames'
import { deleteRoute } from '@app/pages/api/functions'
import { Button as ChakraButton } from '@chakra-ui/react'
import { refreshSsr } from '@app/utils'

function Page({
    site,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
    return (
        <>
            <div className='text-4xl font-semibold capitalize'>{site.name}</div>
            <Block className='flex flex-col w-full px-6 py-6 space-y-6'>
                <div className='flex flex-col space-y-3'>
                    <div className='font-medium opacity-60 uppercase'>
                        Domains
                    </div>
                    {site.domains.map((domain) => {
                        const domainHref = domain.host
                        return (
                            <Link
                                underline
                                key={domain?.id}
                                href={`https://${domainHref}`}
                                className='underline'
                            >
                                {domainHref}
                            </Link>
                        )
                    })}
                </div>
            </Block>
            <div className=''>Routes</div>
            <RoutesBlock
                bestHost={site.domains[0].host}
                routes={site.routes || []}
            />
        </>
    )
}

function RoutesBlock({
    routes,
    bestHost,
}: {
    routes: Route[]
    bestHost: string
}) {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [initialRoute, setInitialRoute] = useState<Partial<Route>>()
    let wClass = `gap-3 [&>*]:!w-[33%]`
    let href = `https://${bestHost}`
    const router = useRouter()
    const siteId = router.query.siteId as string
    // routes =
    return (
        <>
            <Block className=''>
                <div className={classNames('flex ', wClass)}>
                    <div className=''>PATH</div>
                    <div className=''>URL</div>
                    <div className=''></div>
                </div>
                {routes.map((route) => {
                    return (
                        <div
                            key={route.id}
                            className={classNames(
                                ' rounded-lg bg-gray-100 dark:bg-gray-500/10 px-5 py-3',
                                // 'border-t pt-4',
                                'flex items-center',
                                wClass,
                            )}
                        >
                            <a
                                href={new URL(route.basePath, href).toString()}
                                target='_blank'
                                className='font-medium '
                            >
                                <InlineCode className='!py-1 font-bold'>
                                    {route.basePath}
                                </InlineCode>
                            </a>
                            <a
                                href={route.targetUrl}
                                target='_blank'
                                className='font-medium underline'
                            >
                                {route.targetUrl}
                            </a>
                            <div className='flex justify-center'>
                                {/* <div className='grow'></div> */}
                                <RouteDeleteButton route={route} />
                            </div>
                        </div>
                    )
                })}
                {/* <div className='mt-2 border-t'></div> */}
                <div className='flex'>
                    {/* <div className='grow'></div> */}
                    <ChakraButton
                        // bg='blue.500'
                        // bgDark='blue.300'
                        // className='text-sm'

                        children='Add Route'
                        size={'sm'}
                        onClick={() => {
                            setInitialRoute({
                                basePath: '',
                                targetUrl: '',
                            })
                            onOpen()
                        }}
                    />
                </div>
            </Block>
            <RouteModal {...{ isOpen, onOpen, onClose, initialRoute }} />
        </>
    )
}

export const Tabs = () => {
    const {
        query: { siteId },
    } = useRouter()
    const base = `/board/site/${siteId}`
    const iconClass = 'w-[20px] h-[20px]'
    return (
        <>
            <TabLink
                key='overview'
                aria-label='go to site overview'
                href={base}
                icon={<HomeIcon className={iconClass} />}
            >
                Overview
            </TabLink>
            <TabLink
                key='domains'
                aria-label='go to site domains'
                href={base + '/domains'}
                icon={<LinkIcon className={iconClass} />}
            >
                Domains
            </TabLink>
            {/* <TabLink
                key='customization'
                href={base + '/customization'}
                aria-label='go to site customization'
                icon={<BeakerIcon className={iconClass} />}
            >
                Customization
            </TabLink> */}

            <TabLink
                key='settings'
                href={base + '/options'}
                aria-label='go to site settings'
                icon={<AdjustmentsIcon className={iconClass} />}
            >
                Settings
            </TabLink>
            <TabLink
                key='upgrade'
                aria-label='upgrade'
                href='/board/upgrade'
                icon={<CreditCardIcon className={iconClass} />}
                isUpgradeButton
            >
                Upgrade
            </TabLink>
        </>
    )
}

Page.Tabs = Tabs

export default Page

export const getServerSideProps = requiresAuth(
    async ({ req, res, params }, session) => {
        const siteId = params.siteId as string
        if (!siteId) {
            return {
                notFound: true,
            }
        }
        const userId = session.jwt.userId
        const site = await prisma.site.findFirst({
            where: { id: siteId, users: { some: { userId } } },
            include: {
                routes: true,
                domains: true,
            },
        })
        if (!site) {
            return redirectionOnNoSite
        }
        return {
            props: {
                site,
                session,
            },
        }
    },
)

function RouteDeleteButton({ route }) {
    const router = useRouter()
    const siteId = router.query.siteId as string
    const { fn: deleteRouteClient, isLoading } = useThrowingFn({
        fn: async () => {
            await deleteRoute({
                routeId: route.id,
                siteId,
            })
            await refreshSsr()
        },
    })
    return (
        <ChakraButton
            onClick={deleteRouteClient}
            variant='ghost'
            isLoading={isLoading}
            size='sm'
            colorScheme='red'
            // biggerOnHover
            // ghost
        >
            Delete
        </ChakraButton>
    )
}
