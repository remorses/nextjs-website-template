import '@app/styles/index.css'
import 'baby-i-am-faded/styles.css'
import type { AppProps } from 'next/app'
import { SessionProvider, signIn } from 'next-auth/react'
import { ThemeProvider } from 'next-themes'
import { createTheme, NextUIProvider } from '@nextui-org/react'

import { Fragment, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import { AppError } from '@app/utils'
import toast, { Toaster } from 'react-hot-toast'
import { DashboardLayout } from 'beskar/src/DashboardLayout'
import { MyFooter, MyHeader } from '@app/components/specific'
import colors from 'tailwindcss/colors'

colors.gray = colors.neutral

const formattedColors = Object.fromEntries(
    Object.keys(colors)
        .flatMap((colorName) => {
            const colorObj = colors[colorName]
            if (typeof colorObj === 'string') {
                return [[colorName, colorObj]]
            }
            return Object.keys(colorObj).map((colorNumber) => {
                if (!colorName) {
                    return null
                }
                return [`${colorName}-${colorNumber}`, colorObj[colorNumber]]
            })
        })
        .filter(Boolean),
)

// console.log(formattedColors)
const lightTheme = createTheme({
    type: 'light',
    className: 'light',
    theme: {
        colors: {
            ...formattedColors,
            backgroundContrast: '#fff',
        },
    },
})

const darkTheme = createTheme({
    type: 'dark',
    className: 'dark',
    theme: {
        colors: {
            ...formattedColors,
            backgroundContrast: colors.neutral['800'],
        },
    },
})

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
    const router = useRouter()
    const Wrapper: any = useMemo(() => {
        if (router.asPath.startsWith('/org')) {
            return ({ Tabs, children, ...rest }) => (
                <DashboardLayout
                    header={<MyHeader />}
                    footer={<MyFooter />}
                    Tabs={Tabs}
                    {...rest}
                >
                    {children}
                </DashboardLayout>
            )
        }
        return ({ children }) => <Fragment>{children}</Fragment>
    }, [router.asPath])
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
    return (
        <SessionProvider session={session}>
            <ThemeProvider
                defaultTheme='light'
                enableSystem={true}
                attribute='class'
                value={{
                    light: lightTheme.className,
                    dark: darkTheme.className,
                }}
            >
                <Toaster
                    containerStyle={{ zIndex: 10000 }}
                    position='top-center'
                />
                <NextUIProvider disableBaseline>
                    <Wrapper Tabs={Component.Tabs}>
                        <Component {...pageProps} />
                    </Wrapper>
                </NextUIProvider>
            </ThemeProvider>
        </SessionProvider>
    )
}
export default MyApp
