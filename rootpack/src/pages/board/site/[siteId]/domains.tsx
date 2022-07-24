import { TableBlock } from 'beskar/dashboard'
import { DomainModal } from '@app/components/DomainModal'
import { UpgradeModal } from '@app/components/UpgradeModal'
import { Link, useThrowingFn } from 'beskar/landing'
import { env } from '@app/env'

import { fetchWithTimeout } from '@app/utils'
import {
    getSiteLimits,
    redirectionOnNoSite,
    requiresAuth,
} from '@app/utils/ssr'
import {
    Button,
    IconButton,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalOverlay,
    useToast,
} from '@chakra-ui/react'
import { CogIcon, QuestionMarkCircleIcon } from '@heroicons/react/solid'
import splitbee from '@splitbee/web'
import { Faded } from 'baby-i-am-faded'
import classNames from 'classnames'
import { atom, useAtom } from 'jotai'
import { useUpdateAtom } from 'jotai/utils'
import memoize from 'micro-memoize'
import { InferGetServerSidePropsType } from 'next'
import { useRouter } from 'next/router'
import { Domain, prisma } from 'db'
import React, {
    ComponentPropsWithoutRef,
    forwardRef,
    useMemo,
    useState,
} from 'react'
import useSWR from 'swr'
import { Tabs } from './index'
import toast from 'react-hot-toast'
import { deleteCustomDomain } from '@app/pages/api/functions'

// TODO update with fly.io ip
const IP = '0.0.0.0'

function Page({
    site,
    userId,
    subscription,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const domains = site.domains

    const router = useRouter()
    const siteId = router.query.siteId as string
    const setDomainModalState = useUpdateAtom(DomainModal.atom)
    const setDnsModalState = useUpdateAtom(DNSModal.atom)
    const updateUpgradeModalState = useUpdateAtom(UpgradeModal.atom)

    const rows = domains.map((domain: Domain) => {
        const domainHost = domain.host
        return [
            <Link key='url' href={`https://${domainHost}`}>
                {domainHost}
            </Link>,
            <DomainStatus key='status' host={domain.host} />,
            <div key='button' className='flex items-center space-x-3'>
                <div className='flex-auto'></div>

                {domain.domainType === 'customDomain' && (
                    <DomainDeleteButton domain={domain} site={site} />
                )}
                <IconButton
                    size='sm'
                    aria-label='domain settings'
                    variant='ghost'
                    onClick={() => {
                        setDomainModalState({
                            isOpen: true,
                            domain,
                            title: 'Modify domain',
                        })
                    }}
                    icon={<CogIcon className='w-5 h-5' />}
                    className=''
                />
            </div>,
        ]
    })
    return (
        <Faded cascade className='space-y-8'>
            <div className='flex items-center'>
                <div className='font-medium '>Site Domains</div>
                <div className='flex-auto'></div>
                <div
                    onClick={() =>
                        setDnsModalState({
                            isOpen: true,
                            host: '',
                        })
                    }
                    className={classNames(
                        'tracking-wide text-sm space-x-2 opacity-60 items-center',
                        'font-medium flex cursor-pointer',
                    )}
                >
                    <QuestionMarkCircleIcon className='w-4 h-4' />
                    <div className=''>How to setup DNS?</div>
                </div>
            </div>
            <TableBlock head={['HOST', 'DNS', '']} rows={rows} />
            <div className=''>
                <Button
                    colorScheme='blue'
                    onClick={() => {
                        splitbee.track('add custom domain', { userId })

                        setDomainModalState({
                            isOpen: true,
                            domain: null,
                            title: 'Add new domain',
                        })
                    }}
                >
                    Add New Domain
                </Button>
            </div>
            <DomainModal
                siteId={router?.query?.siteId}
                onEnd={(data) => {
                    if (!data.host.endsWith(env.NEXT_PUBLIC_APPS_DOMAIN)) {
                        setDnsModalState({
                            isOpen: true,
                            host: data.host || '',
                        })
                    }
                }}
            />
            <DNSModal />
        </Faded>
    )
}

function DomainDeleteButton({ site, domain }) {
    const router = useRouter()
    const { isLoading, fn: handleDeleteDomain } = useThrowingFn({
        successMessage: `Removed ${domain.host}`,
        fn: async function handleDeleteDomain() {
            try {
                await deleteCustomDomain({
                    domainId: domain.id,
                    siteId: site.id,
                })
            } catch (e) {
                toast.error
            } finally {
                router.replace(router.asPath)
            }
        },
    })
    return (
        <Button
            isLoading={isLoading}
            disabled={isLoading}
            size='sm'
            onClick={handleDeleteDomain}
            colorScheme='red'
            aria-label='delete domain'
            variant='ghost'
        >
            Delete
        </Button>
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
            where: {
                users: { some: { userId } },
                id: siteId,
            },
            include: {
                domains: {
                    where: {
                        domainType: { in: ['customDomain', 'internalDomain'] },
                    },
                },
                users: { where: { role: 'ADMIN' } },
            },
        })
        if (!site) {
            return redirectionOnNoSite
        }
        const { sub: subscription, limits } = await getSiteLimits(siteId)
        return {
            props: {
                site,
                userId: jwt.userId,
                subscription,
                limits,
            },
        }
    },
)

const atomDNSModal = atom({ isOpen: false, host: '' })

DNSModal.atom = atomDNSModal

function DNSModal({}) {
    const [{ isOpen, host }, setState] = useAtom(atomDNSModal)
    function onClose() {
        setState((x) => ({ ...x, isOpen: false }))
    }
    const subdomain = host.split('.').slice(0, -2).join('.') || '@'
    return (
        <Modal size='3xl' isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <div className='p-6 pb-0 space-y-4'>
                    <div className='text-lg font-medium'>
                        Add the following DNS records to your domain
                    </div>
                    <div className='font-medium opacity-70'>
                        Your site will be accessible at{' '}
                        <span className='underline'>
                            {' '}
                            {host ? `${host}` : `your-domain.com`}
                        </span>
                    </div>
                </div>

                <ModalBody>
                    <div className='space-y-6 font-medium'>
                        <div className=''></div>
                        <TableBlock
                            head={['RECORD TYPE', 'NAME/HOST', 'VALUE/IP']}
                            rows={[['A', host ? `${subdomain}` : '@', IP]]}
                        />
                    </div>
                </ModalBody>

                <ModalFooter></ModalFooter>
                <ModalCloseButton />
            </ModalContent>
        </Modal>
    )
}

const DomainStatus = forwardRef<
    any,
    {
        host: string
    } & ComponentPropsWithoutRef<'div'>
>(({ host, onClick, className = '', ...props }, ref) => {
    const { data: dnsResolved = false, isValidating: isLoading } = useSWR(
        ['resolveDns', host],
        async (_, host) => {
            if (host.endsWith(env.NEXT_PUBLIC_APPS_DOMAIN)) {
                return true
            }
            const isUp = await isSiteUp({ domain: host })
            return isUp
        },
    )
    const bgColor = dnsResolved ? 'bg-emerald-500' : 'bg-amber-500'
    // const setModalState = useUpdateAtom(atomDNSModal)
    return (
        <div
            onClick={onClick}
            ref={ref}
            className={classNames(
                'flex relative min-w-[40px] h-5 space-x-2 items-center',
                className,
            )}
            {...props}
        >
            {!isLoading && (
                <>
                    <div
                        className={classNames(
                            'rounded-full animate-pulse w-2 h-2',
                            bgColor,
                        )}
                    ></div>
                    <div
                        style={dnsResolved ? {} : { cursor: 'pointer' }}
                        className={classNames(
                            'text-xs font-semibold tracking-wide uppercase',
                            'opacity-70',
                        )}
                    >
                        {dnsResolved ? 'Resolved DNS' : 'Waiting for DNS'}
                    </div>
                </>
            )}
            {isLoading && (
                <div
                    className={classNames(
                        'rounded-md inset-0 bg-gray-100 animate-pulse',
                        'absolute !ml-0 dark:bg-gray-700',
                    )}
                />
            )}
        </div>
    )
})

DomainStatus.displayName = 'DomainStatus'

const isSiteUp = memoize(
    async function isSiteUp({ domain }) {
        try {
            const res = await fetchWithTimeout(
                `https://${domain}/__check_health`,
                {
                    timeout: 4000,
                    method: 'GET',
                },
            )
            return res.ok
        } catch (e) {
            return false
        }
    },
    { isPromise: true },
)
