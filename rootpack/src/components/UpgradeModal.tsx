import { getProducts } from '@app/pages/api/functions'
import { atomUpgradeModal } from '@app/utils/atoms'
import { Modal } from 'beskar/landing'

import classNames from 'classnames'
import { useAtom } from 'jotai'
import memoize from 'micro-memoize'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { MyPricing } from './specific'

UpgradeModal.atom = atomUpgradeModal

const getMemoizedProducts = memoize(getProducts, { isPromise: true })



export function UpgradeModal() {
    const [{ isOpen, reason, siteId }, setUpgradeModalState] =
        useAtom(atomUpgradeModal)
    const router = useRouter()

    useEffect(() => {
        router.events.on('routeChangeStart', () => {
            if (isOpen) {
                setUpgradeModalState({ isOpen: false, reason, siteId })
            }
        })
    }, [])
    const onClose = () =>
        setUpgradeModalState({ isOpen: false, reason, siteId })
    return (
        <Modal
            useDefaultContentStyle
            isOpen={isOpen}
            onClose={onClose}
            className='lg:min-w-[700px] lg:max-w-max'
            content={
                <div className=''>
                    <Modal.CloseButton onClick={onClose} />
                    <PricingModalContent
                        siteId={siteId}
                        onCheckout={() => {
                            onClose()
                        }}
                    />
                </div>
            }
        ></Modal>
    )
}

export function PricingModalContent({ siteId, onCheckout }) {
    const [isLoading, setIsLoading] = useState(true)
    const { status } = useSession()
    const [products, setProducts] = useState<any[]>([])
    const router = useRouter()

    useEffect(() => {
        if (!products.length) {
            setIsLoading(true)
            getMemoizedProducts()
                .then((data) => {
                    setProducts(data.products)
                    setIsLoading(false)
                })
                .catch((e) => {
                    setIsLoading(false)
                    toast.error('Error fetching pricing plans')
                })
        }
    }, [])

    return (
        <div
            className={classNames(
                'flex flex-col items-center justify-center p-6',
                'pb-12 space-y-8',
            )}
            aria-label='upgrade modal'
        >
            <div className='text-xl font-semibold'>Upgrade your plan</div>

            <MyPricing
                siteId={siteId}
                onCheckout={({ isChangePlan }) => {
                    // mutate()
                    if (onCheckout) onCheckout()
                    if (isChangePlan) {
                        router.replace(router.asPath)
                    }
                }}
                isLoading={isLoading || status === 'loading'}
                products={products}
            />
        </div>
    )
}
