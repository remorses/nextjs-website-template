import { BlockWithStep } from 'beskar/dashboard'
import {
    Button,
    GoogleLoginButton,
    GradientRect,
    Hero,
    PageContainer,
    useThrowingFn,
} from 'beskar/landing'
import { MyFooter, MyNavbar } from '@app/components/specific'

// import { useSignupReason } from '@app/utils'
import { ChakraProvider, Heading, Input } from '@chakra-ui/react'
import classNames from 'classnames'
import clsx from 'classnames'
import { signIn, useSession } from 'next-auth/react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'

import { AppError } from '@app/utils/errors'
import { createSite } from './api/functions'

export default function Page() {
    return (
        <ChakraProvider>
            <div
                className={clsx(
                    'flex bg-white flex-col items-stretch relative space-y-[30px]',
                    'md:space-y-[30px] min-h-screen',
                )}
            >
                <MyNavbar />
                <Head>
                    <title>New project</title>
                </Head>
                {/* <Hero
                    className='!mt-28'
                    heading={
                        <Heading
                            // fontFamily='tiempos-headline, Georgia'
                            fontSize='74px'
                            fontWeight='bold'
                        >
                            Redeem Code
                        </Heading>
                    }
                    subheading='Before redeeming your code you will need to create an account.'
                    floatingElement={
                        <>
                            <GradientRect
                                className='z-20 !max-w-3xl opacity-80'
                                distortion={0.3}
                            />
                            <div
                                style={{ filter: 'saturate(90%)' }}
                                className={classNames(
                                    '!absolute w-full hidden opacity-80 self-center -top-20 !mt-0 max-w-[1400px]',
                                    'md:block',
                                )}
                            ></div>
                        </>
                    }
                /> */}

                <PageContainer className='!mt-0 mb-32'>
                    <Form />
                </PageContainer>
                <div className='grow'></div>
                <MyFooter />
            </div>
        </ChakraProvider>
    )
}

export function Form({}) {
    const { data: session, status } = useSession()
    const userId = session?.user?.id
    const router = useRouter()

    const { fn: onSubmit, isLoading } = useThrowingFn({
        async fn(data) {
            try {
                const { name, fallback } = data
                const site = await createSite({
                    name,
                    routes: [{ basePath: '/', targetUrl: fallback }],
                    setAsDefault: true,
                })
                
                await router.push(`/site/${site.id}`)
            } catch (e) {
                throw e
            }
        },
        successMessage: 'Created site',
        errorMessage: 'Failed',
    })

    const { register, handleSubmit, reset, watch, getValues, formState } =
        useForm({
            defaultValues: {
                name: '',
                fallback: '',
            },
        })

    const disabled = !userId

    return (
        <div className='flex flex-col items-center pt-10 '>
            <div
                className={clsx(
                    'flex w-full flex-col items-center bg-gray-100 rounded-lg px-20 pb-10',
                    'border max-w-[var(--pageWidth)]',
                )}
            >
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className='mx-6 min-w-[500px]'
                >
                    <BlockWithStep step={1} className=''>
                        <div className=''>Enter Name</div>
                        <Input
                            bg='white'
                            placeholder='Name'
                            aria-label='name'
                            {...register('name', {
                                required: true,
                                // validate: (x: string) => {
                                //     return
                                // },
                            })}
                        />
                        <div className='text-red-500'>
                            {formState?.errors?.name?.message}
                        </div>
                    </BlockWithStep>
                    <BlockWithStep step={2} className=''>
                        <div className=''>Main url</div>
                        <Input
                            bg='white'
                            placeholder='https://example.com'
                            aria-label='fallback'
                            {...register('fallback', {
                                required: true,
                                validate: (x: string) => {
                                    if (
                                        !x.startsWith('http://') &&
                                        !x.startsWith('https://')
                                    ) {
                                        return 'Must be an url'
                                    }
                                    try {
                                        const url = new URL(x)
                                        if (
                                            url.pathname &&
                                            url.pathname !== '/'
                                        ) {
                                            return 'Must not have path'
                                        }
                                    } catch {
                                        return 'Invalid url'
                                    }
                                },
                            })}
                        />
                        <div className='text-red-500'>
                            {formState?.errors?.fallback?.message}
                        </div>
                    </BlockWithStep>
                    <BlockWithStep isLast step={3} className=''>
                        <div className='flex flex-col items-center space-y-4'>
                            <Button
                                type='submit'
                                className='text-white min-w-[20ch]'
                                disabled={disabled}
                                isLoading={isLoading}
                            >
                                Create
                            </Button>
                        </div>
                    </BlockWithStep>
                </form>
            </div>
        </div>
    )
}
