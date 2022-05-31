import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { Button } from '@nextui-org/react'
import { signIn, useSession } from 'next-auth/react'
import clsx from 'clsx'
import { prisma } from 'prisma-client/'

const Home: NextPage = () => {
    const { data: session } = useSession()
    return (
        <div className='flex flex-col items-center space-y-4'>
            <Button
                onClick={() => {
                    signIn('google', {
                        callbackUrl: new URL(
                            '/dashboard',
                            window.location.href,
                        ).toString(),
                        redirect: true,
                    })
                }}
                className='flex space-x-4 text-white'
            >
                <div className='flex flex-row items-center space-x-2 font-bold tracking-wide text-white'>
                    <GoogleIcon className='block w-5 h-5 fill-current' />
                    <div className='text-white'>Continue with Google</div>
                </div>
            </Button>
            <pre className=''>{JSON.stringify(session, null, 2)}</pre>
        </div>
    )
}

function TwitterIcon({ className = '' }) {
    return (
        <svg
            aria-hidden='true'
            focusable='false'
            data-prefix='fab'
            data-icon='twitter'
            className={clsx('w-6 h-6', className)}
            role='img'
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 512 512'
        >
            <path
                fill='currentColor'
                d='M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z'
            />
        </svg>
    )
}

export default Home

function GoogleIcon({ ...rest }) {
    return (
        <svg
            xmlns='http://www.w3.org/2000/svg'
            x='0px'
            y='0px'
            viewBox='0 0 30 30'
            {...rest}
        >
            <path d='M 15.003906 3 C 8.3749062 3 3 8.373 3 15 C 3 21.627 8.3749062 27 15.003906 27 C 25.013906 27 27.269078 17.707 26.330078 13 L 25 13 L 22.732422 13 L 15 13 L 15 17 L 22.738281 17 C 21.848702 20.448251 18.725955 23 15 23 C 10.582 23 7 19.418 7 15 C 7 10.582 10.582 7 15 7 C 17.009 7 18.839141 7.74575 20.244141 8.96875 L 23.085938 6.1289062 C 20.951937 4.1849063 18.116906 3 15.003906 3 z' />
        </svg>
    )
}
