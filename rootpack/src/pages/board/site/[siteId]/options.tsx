import { createInviteLink, removeUserFromSite } from '@app/pages/api/invites'
import { refreshSsr } from '@app/utils'
import { getSiteLimits, redirectionOnNoSite, requiresAuth } from '@app/utils/ssr'
import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
    Badge,
    Button,
    Checkbox,
    Input,
    useToast,
} from '@chakra-ui/react'
import { Faded } from 'baby-i-am-faded'
import { Block, SaveButton, TableBlock } from 'beskar/dashboard'
import {
    Link,
    Modal,
    ToggleButton,
    useDisclosure,
    useThrowingFn,
} from 'beskar/landing'
import clsx from 'classnames'
import { InferGetServerSidePropsType } from 'next'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

import { prisma, Site, SitesUsers, User, UserRole } from 'db'
import React, { CSSProperties, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Tabs } from './index'
import { deleteSite, updateSite } from '@app/pages/api/functions'

function Page({
    site,
    sub,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const router = useRouter()

    return (
        <Faded cascade className='space-y-8'>
            <div className='font-medium '>Options</div>
            <BasicInfoBlock sub={sub} site={site} />
            <div className='font-medium '>Users</div>
            <UsersBlock users={site.users || []} site={site} />
            <div className='font-medium '>Delete this site</div>
            <DeleteBlock site={site} />
        </Faded>
    )
}

function UsersBlock({
    site,
    users,
}: {
    site: Site
    users: (SitesUsers & {
        user: User
    })[]
}) {
    const router = useRouter()
    const { data: session } = useSession()
    const colors: Record<UserRole, string> = {
        ADMIN: 'blue',
        GUEST: 'gray',
    }
    const { isOpen, onClose, onOpen } = useDisclosure()
    const { isLoading, fn: createInvitationLinkClient } = useThrowingFn({
        async fn() {
            setInviteLink('')
            const { url } = await createInviteLink({ siteId: site.id })
            setInviteLink(url)
            onOpen()
        },
    })
    const adminUserId = users.find((x) => x.role === 'ADMIN')?.userId
    const [inviteLink, setInviteLink] = useState('')
    return (
        <Block className='!p-6 space-y-8'>
            <div className='space-y-4'>Site users</div>
            <TableBlock
                head={['NAME', 'EMAIL', 'ROLE']}
                rows={users.map((u) => {
                    return [
                        <div key='1' className=''>
                            {u.user.name}
                        </div>,
                        <div key='2' className=''>
                            {u.user.email}
                        </div>,
                        <Badge
                            size={'sm'}
                            key='badge'
                            className='text-xs opacity-80'
                            colorScheme={colors[u.role]}
                        >
                            {u.role}
                        </Badge>,
                        <DeleteUserButton
                            disabled={
                                u.role === 'ADMIN' ||
                                // guest can only remove himself
                                (session?.user?.id !== adminUserId &&
                                    session?.user?.id !== u.user.id)
                            }
                            key='delete'
                            userId={u.userId}
                        />,
                    ]
                })}
            />
            <div className=''>
                <Button
                    size={'sm'}
                    className=''
                    onClick={async () => {
                        await createInvitationLinkClient()
                    }}
                    // disabled={adminUserId !== session?.user?.id}
                    isLoading={isLoading}
                >
                    Invite New User
                </Button>
            </div>
            <Modal
                content={
                    <div
                        className={clsx(
                            'bg-white dark:bg-gray-700 w-full',
                            'p-8 space-y-8',
                        )}
                    >
                        <Modal.CloseButton onClick={onClose} />
                        <div className='font-medium'>
                            Send the following link to invite users to your
                            website
                        </div>
                        <div className='opacity-80'>
                            The link will expire in 1 day
                        </div>
                        <div className=''>
                            <Link
                                aria-label='invite-link'
                                href={inviteLink}
                                target='_blank'
                                underline
                            >
                                {inviteLink}
                            </Link>
                        </div>
                    </div>
                }
                isOpen={isOpen}
                onClose={onClose}
            ></Modal>
        </Block>
    )
}

function DeleteUserButton({ userId, ...rest }) {
    const router = useRouter()
    const siteId = router.query.id as string
    const { fn: deleteUserClient, isLoading } = useThrowingFn({
        async fn() {
            await removeUserFromSite({ siteId: siteId, userToRemove: userId })
            await refreshSsr()
        },
    })
    return (
        <Button
            isLoading={isLoading}
            size='sm'
            onClick={deleteUserClient}
            colorScheme='red'
            aria-label='delete user'
            variant='ghost'
            {...rest}
        >
            Remove
        </Button>
    )
}

function BasicInfoBlock({
    site,
    sub,
    style,
}: {
    site: Site
    sub
    style?: CSSProperties
}) {
    const toast = useToast({ position: 'top' })
    const router = useRouter()

    const { register, handleSubmit, reset, formState, control } = useForm({
        defaultValues: {
            name: site.name,
        },
    })

    async function onSubmit(data) {
        try {
            const { name } = data

            const res = await updateSite({
                name,
                siteId: site.id,
            })
            toast({
                title: 'Updated',
                status: 'success',
                description: 'Successfully updated site',
            })
            reset(data)
            router.replace(router.asPath)
        } catch (e) {
            reset()
            // reset({}, { keepDefaultValues: true })
            // router.replace(router.asPath)
            toast({ description: e.message, title: 'Error', status: 'error' })
        }
    }
    const { errors } = formState
    // changelog does not have paths

    return (
        <Block style={style} className='!p-6 space-y-8'>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-10'>
                <div className='space-y-3'>
                    <div>Name</div>
                    <Input
                        placeholder='Example Name'
                        {...register('name', { required: true })}
                    />
                    {errors.name && (
                        <div className='text-red-500'>
                            {errors.name.message}
                        </div>
                    )}
                </div>

                <div className='flex items-center'>
                    <div className='flex-auto' />
                    <SaveButton formState={formState} />
                </div>
            </form>
        </Block>
    )
}

function DeleteBlock({ site, style }: { site: Site; style?: CSSProperties }) {
    const toast = useToast({ position: 'top' })
    const router = useRouter()
    const [isOpen, setIsOpen] = React.useState(false)
    const [isDeleting, setIsDeleting] = React.useState(false)
    const onClose = () => setIsOpen(false)
    const cancelRef = React.useRef()
    async function onDelete() {
        try {
            setIsDeleting(true)
            await deleteSite({ siteId: site.id })
            toast({
                status: 'success',
                title: 'Deleted',
                description: 'Successfully deleted site',
            })
            await router.replace('/board')
        } catch (e) {
            toast({ title: 'Error', description: e.message, status: 'error' })
        } finally {
            setIsDeleting(false)
            onClose()
        }
    }
    return (
        <Block style={style} className='!p-6 space-y-3'>
            <div className=''>
                <Button
                    colorScheme='red'
                    ml='-3'
                    variant='ghost'
                    aria-label='delete site'
                    onClick={() => setIsOpen(true)}
                >
                    Delete
                </Button>
            </div>

            <AlertDialog
                isOpen={isOpen}
                leastDestructiveRef={cancelRef}
                onClose={onClose}
                isCentered
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                            Delete Site
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            {`Are you sure? You can't undo this action.`}
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button size='sm' ref={cancelRef} onClick={onClose}>
                                Cancel
                            </Button>
                            <Button
                                isLoading={isDeleting}
                                colorScheme='red'
                                aria-label='confirm delete'
                                onClick={onDelete}
                                ml={3}
                                size='sm'
                            >
                                Delete
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </Block>
    )
}

Page.Tabs = Tabs

export default Page

export const getServerSideProps = requiresAuth(
    async ({ req, res, params }, { jwt }) => {
        const siteId = params.siteId as string
        if (!siteId) {
            return {
                notFound: true,
            }
        }
        const userId = jwt.userId
        const site = await prisma.site.findFirst({
            where: { id: siteId, users: { some: { userId } } },
            include: {
                domains: true,
                users: { include: { user: true } },
            },
        })

        if (!site) {
            return redirectionOnNoSite
        }
        const { sub, limits } = await getSiteLimits(siteId)
        return {
            props: {
                site,
                sub,
                // users: site.users,
            },
        }
    },
)
