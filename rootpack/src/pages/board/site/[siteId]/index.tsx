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
import { redirectOnNoSite as redirectionOnNoSite, requiresAuth } from '@app/utils/ssr'
import { prisma, Route } from 'db'
import { InferGetServerSidePropsType } from 'next/types'
import { Fragment, useState } from 'react'
import { Button, Link, useDisclosure } from 'beskar/landing'
import { RouteModal } from '@app/components/RouteModal'

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
            <RoutesBlock routes={site.routes || []} />
        </>
    )
}

function RoutesBlock({ routes }: { routes: Route[] }) {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [initialRoute, setInitialRoute] = useState<Partial<Route>>()
    return (
        <>
            <TableBlock
                head={['Path', 'Url', '']}
                rows={routes.map((route) => {
                    return (
                        <Fragment key={route.id}>
                            <TableBlock.TData className='font-medium'>
                                {route.basePath}
                            </TableBlock.TData>
                            <TableBlock.TData className='font-medium'>
                                {route.targetUrl}
                            </TableBlock.TData>
                            <TableBlock.TData className=''>
                                <Button
                                    onClick={() => {
                                        setInitialRoute(route)
                                        onOpen()
                                    }}
                                    className='underline text-sm'
                                    ghost
                                >
                                    Edit
                                </Button>
                            </TableBlock.TData>
                        </Fragment>
                    )
                })}
                footer={
                    <div className='flex'>
                        <div className='grow'></div>
                        <Button
                            bg='blue.500'
                            bgDark='blue.300'
                            className='text-sm'
                            children='Add Route'
                            onClick={() => {
                                setInitialRoute({ basePath: '', targetUrl: '' })
                                onOpen()
                            }}
                        />
                    </div>
                }
                className=''
            ></TableBlock>
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
