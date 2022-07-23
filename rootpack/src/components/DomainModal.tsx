import { env } from '@app/env'

import { atomDomainModal } from '@app/utils/atoms'
import {
    Button,
    Input,
    InputGroup,
    InputRightAddon,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
} from '@chakra-ui/react'
import isValidDomain from 'is-valid-domain'
import { useAtom } from 'jotai'
import { useRouter } from 'next/router'

import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Alert } from 'beskar/dashboard'
import { useThrowingFn } from 'beskar/landing'
import { createDomain, updateDomain } from '@app/pages/api/functions'

DomainModal.atom = atomDomainModal

export function DomainModal({ siteId, onEnd }) {
    const [{ isOpen, domain, title }, setState] = useAtom(atomDomainModal)
    const router = useRouter()
    const [flyDomainInUse, setFlyDomainInUse] = useState(false)
    const defaultHostValue = (() => {
        if (!domain?.host) {
            return ''
        }
        let res = domain.host
        res = res.replace('.' + env.NEXT_PUBLIC_APPS_DOMAIN, '')
        return res
    })()
    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: {
            host: defaultHostValue,
        },
    })
    function onClose() {
        setState((x) => ({ isOpen: false }))
    }

    useEffect(() => {
        if (!isOpen) {
            setFlyDomainInUse(false)
            reset({})
        }
    }, [isOpen, reset])

    const isUpdating = Boolean(domain?.id)

    const { fn: onSubmit, isLoading } = useThrowingFn({
        fn: async function submit(data) {
            if (isUpdating) {
                const res = await updateDomain({
                    domainId: domain.id,
                    host: data.host,
                    siteId,
                })
            } else {
                const res = await createDomain({
                    host: data.host,
                    siteId,
                })
            }

            onClose()
            await router.replace(router.asPath)
            await onEnd(data, isUpdating)
        },
        successMessage: isUpdating ? 'Updated domain' : 'Created domain',
        errorMessage: isUpdating
            ? 'Could not update domain'
            : 'Could not create domain',
    })

    const isExternal =
        (domain && domain?.domainType === 'customDomain') || !domain
    // const watchedHost = watch('host')
    // console.log({ domain })
    return (
        <>
            <Modal size='lg' key={domain?.id} isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent mt={{ base: '100px', lg: '200px' }} minH='300px'>
                    <>
                        <ModalHeader>{title}</ModalHeader>

                        <ModalBody>
                            <form
                                id='new-site-form'
                                className='flex flex-col w-full space-y-8'
                                onSubmit={handleSubmit(onSubmit)}
                            >
                                <div className='space-y-3'>
                                    <div>Domain</div>
                                    <InputGroup>
                                        <Input
                                            // variant='filled'
                                            defaultValue={defaultHostValue}
                                            aria-label='new domain'
                                            placeholder={
                                                isExternal
                                                    ? `example.com`
                                                    : 'example'
                                            }
                                            {...register('host', {
                                                required: true,
                                                setValueAs: (host) => {
                                                    if (isExternal) {
                                                        return host
                                                    }
                                                    if (
                                                        !host.includes(
                                                            env.NEXT_PUBLIC_APPS_DOMAIN,
                                                        )
                                                    ) {
                                                        return `${host}.${env.NEXT_PUBLIC_APPS_DOMAIN}`
                                                    }
                                                },
                                                validate: (completeDomain) => {
                                                    if (
                                                        !isValidDomain(
                                                            completeDomain,
                                                        )
                                                    ) {
                                                        return 'Invalid domain'
                                                    }
                                                },
                                            })}
                                        />
                                        {!isExternal && (
                                            <InputRightAddon
                                                children={
                                                    env.NEXT_PUBLIC_APPS_DOMAIN
                                                }
                                            />
                                        )}
                                    </InputGroup>

                                    <div className='text-red-500'>
                                        {errors?.host?.message}
                                    </div>
                                </div>

                                {flyDomainInUse && (
                                    <Alert
                                        type='info'
                                        isVertical
                                        title='Domain is already in use on Fly.io, we just asked permission to use it'
                                        description={
                                            <div>
                                                The Fly.io account owner of this
                                                domain will receive an email to
                                                give Notaku permission to use
                                                it.
                                                <br />
                                                You can retry adding the domain
                                                after the owner has accepted the
                                                request.
                                            </div>
                                        }
                                    />
                                )}
                            </form>
                        </ModalBody>

                        <ModalFooter className='relative z-10' mt='4'>
                            <Button
                                colorScheme='blue'
                                variant='ghost'
                                mr={3}
                                onClick={onClose}
                            >
                                Cancel
                            </Button>
                            <Button
                                type='submit'
                                form='new-site-form'
                                isLoading={isSubmitting}
                                disabled={isSubmitting}
                                colorScheme='blue'
                            >
                                {flyDomainInUse ? 'Retry' : 'Continue'}
                            </Button>
                        </ModalFooter>
                        <ModalCloseButton />
                    </>
                </ModalContent>
            </Modal>
        </>
    )
}
