import '@app/styles/index.css'
import 'baby-i-am-faded/styles.css'
import NextNprogress from 'nextjs-progressbar'
import type { AppProps } from 'next/app'
import { SessionProvider, signIn } from 'next-auth/react'
import { ThemeProvider } from 'next-themes'
import { createTheme, NextUIProvider } from '@nextui-org/react'

import { Fragment, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import { AppError } from '@app/utils/errors'
import toast, { Toaster } from 'react-hot-toast'
import { BeskarProvider } from 'beskar/src/BeskarProvider'
import { NextUiStuff } from 'beskar/src/nextui'
import { MyFooter, MyHeader } from '@app/components/specific'
import colors from 'tailwindcss/colors'
import React from 'react'
import { UpgradeModal } from '@app/components/UpgradeModal'

const DashboardLayout = React.lazy(() => import('beskar/src/DashboardLayout'))

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
    const router = useRouter()
    const isDashboard = router.asPath.startsWith('/board')
    const Wrapper: any = useMemo(() => {
        // console.log(`Creating wrapper`)
        if (isDashboard) {
            return ({ Tabs, children, ...rest }) => (
                <DashboardLayout
                    header={<MyHeader />}
                    footer={<MyFooter />}
                    Tabs={Tabs}
                    {...rest}
                >
                    {children}
                    <UpgradeModal />
                </DashboardLayout>
            )
        }
        return ({ children }) => <Fragment>{children}</Fragment>
    }, [isDashboard])
    useEffect(() => {
        if (process.env.NODE_ENV !== 'production') {
            window.loginForTests = ({ name, email }) => {
                if (!email) {
                    throw new AppError('Email is required for test provider')
                }
                return signIn('test-provider', {
                    name,
                    email,
                    redirect: false,
                })
            }
        }
    }, [])
    const forcedTheme = undefined // !isDashboard ? 'light' : undefined

    return (
        <SessionProvider session={session}>
            <BeskarProvider>
                <ThemeProvider
                    defaultTheme='light'
                    enableSystem={true}
                    attribute='class'
                    forcedTheme={forcedTheme}
                >
                    <Toaster
                        containerStyle={{ zIndex: 10000 }}
                        position='top-center'
                    />
                    <NextNprogress
                        color='#29D'
                        startPosition={0.3}
                        stopDelayMs={200}
                        height={4}
                        options={{ showSpinner: false }}
                        showOnShallow={true}
                    />
                    <NextUiStuff>
                        <Wrapper Tabs={Component.Tabs}>
                            <Component {...pageProps} />
                        </Wrapper>
                    </NextUiStuff>
                </ThemeProvider>
            </BeskarProvider>
        </SessionProvider>
    )
}
export default MyApp
