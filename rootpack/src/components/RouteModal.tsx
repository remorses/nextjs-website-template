import {
    useThrowingFn,
    useDisclosure,
    Modal,
    Button,
    Input,
} from 'beskar/landing'
import { useRouter } from 'next/router'
import { useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { useSWRConfig } from 'swr'
import {} from '@chakra-ui/react'
import { refreshSsr, validateUrl } from '@app/utils'
import { createNewRoute } from '@app/pages/api/functions'

export function RouteModal({ initialRoute, isOpen, onClose }) {
    const router = useRouter()

    const {
        register,
        handleSubmit,
        watch,
        trigger,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: {
            basePath: initialRoute?.basePath,
            targetUrl: initialRoute?.targetUrl,
        },
    })
    useEffect(() => {
        if (!isOpen) {
            reset()
        }
    }, [isOpen, reset])
    useEffect(() => {
        reset(initialRoute)
    }, [initialRoute, reset])
    const { mutate } = useSWRConfig()
    const isUpdate = !!initialRoute?.targetUrl
    const siteId = router.query.siteId as string
    const { fn: onSubmit, isLoading } = useThrowingFn({
        fn: async function onSubmit(data) {
            // throw new Error('not implemented')
            const { basePath, targetUrl } = data
            await createNewRoute({ basePath, targetUrl, siteId })
            await refreshSsr()
            onClose()
        },
        successMessage: 'Success',
    })
    const initialFocusRef = useRef()
    return (
        <Modal
            className='flex flex-col w-full space-y-8 !max-w-xl'
            isOpen={isOpen}
            useDefaultContentStyle
            initialFocus={initialFocusRef}
            onClose={onClose}
            content={
                <form
                    className='space-y-12'
                    id='new-org-form'
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <Modal.CloseButton onClick={onClose} />
                    <div className='font-semibold text-xl text-center'>
                        {isUpdate ? 'Update route' : 'Create route'}
                    </div>

                    <Input
                        ref={initialFocusRef}
                        label='Base Path'
                        description='The website will be available on this path'
                        // underlined
                        placeholder='/path'
                        // helperColor='error'
                        errorMessage={String(errors?.basePath?.message || '')}
                        {...register('basePath', {
                            required: true,
                            validate: (p: string) => {
                                if (!p.startsWith('/')) {
                                    return 'Must start with /'
                                }
                                if (p.split('/').length > 2) {
                                    return 'Must not have more than one /'
                                }
                            },
                        })}
                    />
                    <Input
                        label='Target Url'
                        description='The website to host on the above path'
                        placeholder='https://example.com'
                        // helperColor='error'
                        {...register('targetUrl', {
                            required: true,
                            validate: validateUrl,
                        })}
                        errorMessage={String(errors?.targetUrl?.message || '')}
                    />
                    <div className='flex'>
                        <div className='grow'></div>
                        <Button
                            isLoading={isLoading}
                            className='text-sm self-center'
                            type='submit'
                            as='button'
                        >
                            {isUpdate ? 'Update' : 'Create'}
                        </Button>
                    </div>
                </form>
            }
        />
    )
}
