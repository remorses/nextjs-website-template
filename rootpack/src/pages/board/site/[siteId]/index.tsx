import { ChevronRightIcon, CogIcon, FolderIcon } from '@heroicons/react/solid'
import { TabLink } from 'beskar/src/Tabs'
import { Alert, Block, SaveButton, TableBlock } from 'beskar/dashboard'
import { useRouter } from 'next/router'
import { requiresAuth } from '@app/utils/ssr'
import { prisma, Route } from 'db'
import { InferGetServerSidePropsType } from 'next/types'
import { Fragment, useState } from 'react'
import { Button, useDisclosure } from 'beskar/landing'
import { RouteModal } from '@app/components/RouteModal'

function Page({
    site,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
    return (
        <>
            <Alert
                // type='error'
                description='Hello'
                title={'Hello, happy to see you'}
                className=''
            ></Alert>
            <div className='text-4xl font-semibold capitalize'>{site.name}</div>
            <RoutesBlock routes={site.routes || []} />
        </>
    )
}

function RoutesBlock({ routes }: { routes: Route[] }) {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [initialRoute, setInitialRoute] = useState<Route>()
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
                                setInitialRoute(null)
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

    return [
        <TabLink
            key='1'
            aria-label=''
            href={base}
            icon={<FolderIcon className='w-5 h-5' />}
        >
            Campaigns
        </TabLink>,
        <TabLink
            key='2'
            aria-label=''
            href={`${base}/settings`}
            icon={<CogIcon className='w-5 h-5' />}
        >
            Settings
        </TabLink>,
    ]
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
            where: { id: Number(siteId), users: { some: { userId } } },
            include: {
                routes: true,
            },
        })
        if (!site) {
            return {
                notFound: true,
            }
        }
        return {
            props: {
                site,
                session,
            },
        }
    },
)
