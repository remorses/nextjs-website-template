import {
    useThrowingFn,
    useDisclosure,
    Modal,
    Button,
    Input,
} from 'beskar/landing'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useSWRConfig } from 'swr'
import {} from '@chakra-ui/react'

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
            basePath: '',
            targetUrl: '',
        },
    })
    useEffect(() => {
        if (!isOpen) {
            reset()
        }
    }, [isOpen, reset])
    const { mutate } = useSWRConfig()

    const { fn: onSubmit, isLoading } = useThrowingFn({
        fn: async function onSubmit({ name }) {
            // throw new Error('not implemented')

            onClose()
        },
        successMessage: 'Success',
    })

    return (
        <Modal
            className='flex flex-col w-full space-y-8 !max-w-xl'
            isOpen={isOpen}
            useDefaultContentStyle
            onClose={onClose}
            content={
                <form
                    className='space-y-12'
                    id='new-org-form'
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <Modal.CloseButton onClick={onClose} />
                    <div className='font-semibold text-xl text-center'>
                        {initialRoute ? 'Update route' : 'Create route'}
                    </div>

                    <Input
                        label='Base Path'
                        // underlined
                        placeholder='/path'
                        // helperColor='error'
                        errorMessage={String(errors?.basePath?.message || '')}
                        {...register('basePath', { required: true })}
                    />
                    <Input
                        label='Base Path'
                        // underlined
                        placeholder='https://example.com'
                        // helperColor='error'
                        {...register('targetUrl', { required: true })}
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
                            {initialRoute ? 'Update' : 'Create'}
                        </Button>
                    </div>
                </form>
            }
        />
    )
}
