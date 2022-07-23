// images
import svgBg1 from '@app/../public/landing-page/gradient-bg-sketch.svg'

import heroImage from '@app/../public/hero_image.png'

import {
    Button,
    Divider,
    Feature,
    FeatureLink,
    Hero,
    HowItWorks,
    Link,
    PageContainer,
    Section,
} from 'beskar/landing'
import { Faq, GoogleLoginButton, VideoModal } from 'beskar/src/landing'
import { MyFooter, MyNavbar, MyPricing } from '@app/components/specific'

import {
    ColorSwatchIcon,
    LightningBoltIcon,
    LinkIcon,
    LockClosedIcon,
    MenuAlt2Icon,
    SearchIcon,
    ViewListIcon,
} from '@heroicons/react/solid'
import splitbee from '@splitbee/web'
import { Faded } from 'baby-i-am-faded'
import clsx from 'classnames'
import { useUpdateAtom } from 'jotai/utils'
import cookie from 'js-cookie'
import { SessionProvider, signIn, useSession } from 'next-auth/react'
import { NextSeo } from 'next-seo'
import NextImage from 'next/image'
import { useRouter } from 'next/router'
import React from 'react'
import Image from 'next/image'
import { getPricingProducts } from '@app/utils/ssr'

const BG =
    'radial-gradient( 37.86% 77.79% at 50% 100%, rgba(113,128,150,0.1) 0%, rgba(113,128,150,0) 100% ), linear-gradient(180deg,#1a202c 0%,#1E293B 100%), linear-gradient(180deg,#0d0f14 0%,rgba(27,32,43,0) 100%),#1E293B'

function Page({ products }) {
    const { status } = useSession()
    const router = useRouter()

    return (
        <div className='text-gray-100 dark bg-gray-900 '>
            <style global jsx>{`
                html {
                    color-scheme: dark !important;
                }
            `}</style>
            <NextSeo
                {...{
                    title: 'RootPack - Create a documentation website from Notion',
                    description:
                        'Create docs and knowledge base sites with Notion',
                    canonical: 'https://rootpack.co',
                }}
            />

            <div
                className={clsx(
                    'absolute top-0 left-0 w-screen h-screen opacity-80',
                    'bg-cover lg:bg-contain',
                )}
                style={{
                    // backgroundImage: `url("${svgBg1}")`,
                    backgroundRepeat: 'no-repeat',
                    // backgroundSize: 'contain',
                    backgroundPosition: 'center top',
                }}
            />

            <div
                className={clsx(
                    'flex flex-col items-stretch min-h-full relative h-auto space-y-[30px]',
                    'md:space-y-[80px]',
                )}
            >
                <MyNavbar />
                <Hero
                    className='dark'
                    animate={{
                        whenInView: false,
                        delay: 100,
                    }}
                    bullet='RootPack beta'
                    image={
                        <div className='flex h-full items-end'>
                            <img
                                src={heroImage.src}
                                className='min-w-screen opacity-80 min-w-[600px] md:min-w-[1000px] lg:-ml-[10px]'
                            />
                        </div>
                    }
                    // image=' '
                    // image={
                    //     <div className='p-8 max-w-[360px] relative'>
                    //         <Image
                    //             className='shadow-lg opacity-40 min-w-[200px]'
                    //             alt='video illustration'
                    //             src={videoCta}
                    //         />
                    //         <VideoModal
                    //             className=''
                    //             aspectRatio={14 / 9}
                    //             button={
                    //                 <div className='flex items-center justify-center absolute inset-0'>
                    //                     <VideoModal.PLayButton className='' />
                    //                 </div>
                    //             }
                    //             youtubeVideoId='ItMyDTdRd_c'
                    //         />
                    //     </div>
                    // }
                    heading={
                        <span className='text-5xl font-bold tracking-wide leading-tight'>
                            Put any{' '}
                            <span className='bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-blue-300'>
                                {` website `}
                            </span>
                            <br />
                            on a{' '}
                            <span className='tracking-wider font-mono text-4xl rounded bg-gray-700 py-1 px-1'>
                                /subpath
                            </span>{' '}
                            <br />
                            on your own
                            <span className='bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-blue-200'>
                                {` domain`}
                            </span>
                        </span>
                    }
                    subheading={
                        <div className='leading-relaxed'>
                            RootPack let you host websites <br />
                            on a path instead of a subdomain
                        </div>
                    }
                    cta={
                        <div
                            className={clsx(
                                'flex flex-col gap-4 items-center md:items-start ',
                                'md:flex-row',
                            )}
                        >
                            <GoogleLoginButton
                                callbackPath='/board'
                                text='Sign Up With Google'
                            />

                            {/* <Button
                                href='/docs'
                                ghost
                                bg='gray.500'
                                // className='hover:!bg-white hover:!bg-opacity-10 transition-colors'
                                // bg='transparent'
                            >
                                See demo site
                            </Button> */}
                        </div>
                    }
                />
                <Divider
                    animate={{
                        whenInView: false,
                        delay: 300,
                    }}
                    className='[&_div]:border-gray-600'
                    heading='Works With Any Website Builder'
                />

                <Features
                    features={[
                        {
                            heading: 'Any subpath',
                            description:
                                'You can host websites on any path of your domain',
                            Icon: LinkIcon,
                        },
                        {
                            heading: 'Lightning Fast',
                            description: 'Hosted globally for fastest latency',
                            Icon: LightningBoltIcon,
                        },
                        {
                            heading: 'Great SEO',
                            description:
                                'Improve the SEO compared to subdomains',
                            Icon: SearchIcon,
                        },
                        {
                            heading: 'Customizable',
                            description: 'Inject code, add elements and more',
                            Icon: ColorSwatchIcon,
                            soon: true,
                        },
                        {
                            heading: 'Automatic sitemap',
                            description:
                                'Auto generates a sitemap.xml for all subpaths',
                            Icon: MenuAlt2Icon,
                            soon: true,
                        },
                        {
                            heading: 'Password protection',
                            description:
                                'Add password to pages of your website',
                            Icon: LockClosedIcon,
                            soon: true,
                        },
                    ]}
                />

                <Section degree={0.1} bg={BG}>
                    <Faded
                        whenInView
                        triggerOnce
                        cascade
                        className='relative flex flex-col items-center py-12'
                    >
                        <h2 className='text-6xl font-extrabold text-gray-100 text-center'>
                            Pricing Plans
                        </h2>
                        <p className='max-w-md mt-5 text-xl text-gray-400 text-center'>
                            Pricing is based on the number of page views
                            <br />
                            You can use all the site types with one plan.
                        </p>
                        <MyPricing
                            animate
                            siteId=''
                            promptLogin={() => signIn()}
                            products={products}
                        />
                        {/* <MyFaq /> */}
                    </Faded>
                </Section>

                <MyFooter />
            </div>
        </div>
    )
}

function Features({ style = {}, features }) {
    return (
        <PageContainer style={style}>
            <div>
                <Faded
                    delay={500}
                    cascade
                    className={clsx(
                        'grid justify-center gap-12 md:justify-start xl:gap-28 md:gap-16 xl:grid-cols-3',
                        'sm:grid-cols-2',
                    )}
                >
                    {features.map((feature, i) => (
                        <div key={i} className=''>
                            <div className='flex space-x-4'>
                                <div
                                    className={clsx(
                                        'flex items-center justify-center flex-shrink-0 text-white bg-blue-500',
                                        'rounded-lg shadow-lg opacity-80 w-14 h-14 md:rounded-xl',
                                    )}
                                >
                                    <feature.Icon className='w-6 h-6' />
                                </div>
                                <div className='space-y-1'>
                                    {feature.soon && (
                                        <div className='rounded px-1 py-[2px] tracking-wider -mt-[2.1em] mb-1 font-semibold text-white text-[10px] dark:bg-gray-800 max-w-max'>Coming Soon</div>
                                    )}
                                    <h3 className='text-lg font-semibold md:text-xl'>
                                        {feature.heading}
                                    </h3>
                                    <p className=' opacity-60'>
                                        {feature.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </Faded>
            </div>
        </PageContainer>
    )
}

export default Page

export const getStaticProps = async () => {
    const products = await getPricingProducts()
    return {
        props: {
            products,
        },
    }
}
