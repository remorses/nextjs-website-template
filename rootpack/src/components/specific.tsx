import NextLink from 'next/link'
import { DashboardHeader } from 'beskar/src/Header'
import {
    Footer,
    Link,
    NavBar,
    Pricing,
    PricingProps,
    useColorMode,
    useColorModeValue,
} from 'beskar/landing'
import {
    MoonIcon,
    SunIcon,
    CogIcon,
    LogoutIcon,
    CreditCardIcon,
} from '@heroicons/react/outline'
import { Avatar } from '@nextui-org/react'

import { signIn, signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { AvatarButton } from 'beskar/src/Header'
import { DropDownMenu } from 'beskar/src/DropDown'
import { SelectSite } from './SelectSite'
import { getSubscription } from '@app/pages/api/functions'
import { SVGProps } from 'react'
import classNames from 'classnames'

export function MyHeader({}) {
    const router = useRouter()
    return (
        <DashboardHeader
            logo={
                <div className='flex flex-col gap-3'>
                    <Logo className='!text-3xl' />
                    <SelectSite
                        // there is no site in user settings, just keep loading state
                        doNotRedirect={router.asPath === '/board/settings'}
                    />
                </div>
            }
            links={[
                <Link href='/docs'>Docs</Link>,
                <Link href='/home'>Home</Link>,
                <AvatarMenu />,
                //
            ]}
        />
    )
}

export function MyNavbar({}) {
    return (
        <NavBar
            logo={<Logo />}
            navs={[
                <Link href=''>Docs</Link>,
                <Link href=''>Changelog</Link>, //
                <LoginLink />,
            ]}
        />
    )
}

export function MyFooter({}) {
    return (
        <Footer
            // justifyAround
            columns={{
                Company: [<Link href='/docs'>Docs</Link>],
                'Who made this?': [
                    <Link href='https://twitter.com/__morse'>My Twitter</Link>,
                    <Link href='mailto:tommy@notaku.website'>Contact me</Link>,
                ],
            }}
        />
    )
}

function AvatarMenu({ imgSrc = '' }) {
    const { toggleColorMode, isDark } = useColorMode()
    const router = useRouter()
    const { data: session } = useSession()

    let avatar = (
        <div className=''>
            <AvatarButton
                // squared
                // textColor={'white'}
                // color='gradient'
                className={'border'}
                name={session?.user?.name}
            />
        </div>
    )

    return (
        <DropDownMenu button={avatar}>
            <DropDownMenu.Item
                onClick={toggleColorMode}
                icon={useColorModeValue(
                    <MoonIcon className='w-5 h-5 opacity-60' />,
                    <SunIcon className='w-5 h-5 opacity-60' />,
                )}
            >
                {!isDark ? 'Dark mode' : 'Light Mode'}
            </DropDownMenu.Item>
            <NextLink href={`/board/settings`}>
                <DropDownMenu.Item
                    icon={<CogIcon className='w-5 h-5 opacity-60' />}
                >
                    Settings
                </DropDownMenu.Item>
            </NextLink>
            <DropDownMenu.Item
                onClick={() => {
                    // updateUpgradeModalState({
                    //     isOpen: true,
                    //     reason: '',
                    // })
                }}
                icon={<CreditCardIcon className='w-5 h-5 opacity-60' />}
            >
                Upgrade
            </DropDownMenu.Item>
            <DropDownMenu.Item
                onClick={() => signOut({ callbackUrl: '/' })}
                icon={<LogoutIcon className='w-5 h-5 opacity-60' />}
            >
                Sign out
            </DropDownMenu.Item>
        </DropDownMenu>
    )
}

export function Logo({ className = '' }) {
    // const { status } = useSession()
    return (
        <NextLink href={'/'} passHref>
            <a
                className={classNames(
                    'flex items-center space-x-3 text-4xl font-semibold ',
                    className,
                )}
            >
                <LogoIcon className='' />
                <div className=''>RootPack</div>
            </a>
        </NextLink>
    )
}

const CONTACT_US_LINK = 'mailto:tommy@notaku.website'

const productDetails: PricingProps['productDetails'] = {
    Free: {
        description: '1k views / month',
        features: [
            '1k views / month',
            'notaku.site subdomain',
            'No branding', //
        ],
    },
    Startup: {
        description: '10k views / month',
        features: [
            '10k views / month',
            '3 Custom domains',
            'Single user',
            'Basic branding',
            'User feedback collection',
            'Password protection',
            'Auto sync with Notion every hour',
        ],
    },
    Business: {
        description: '100k views / month',
        features: [
            '100k views / month',
            '6 Custom domains',
            'Invite up to 5 users',
            'Advanced branding',
            'User feedback collection',
            'Password protection',
            'Auto sync with Notion every hour',
        ],
    },
}

// TODO add another pricing over 100k for 99 a month
productDetails.Enterprise = {
    description: 'Unlimited views',
    contactLink: CONTACT_US_LINK,
    features: ['Unlimited views', ...productDetails.Business.features.slice(3)],
}

export function MyPricing({
    onCheckout,
    siteId,
    ...rest
}: Partial<PricingProps> & { siteId: string }) {
    const router = useRouter()
    return (
        <Pricing
            {...{
                products: [],
                async getSubscription() {
                    const d = await getSubscription({ siteId })
                    if (d?.subscription?.product?.billing_type === 'lifetime') {
                        // lifetime deals cannot be upgraded
                        return null
                    }
                    return d.subscription
                },
                async updatePlan(data) {
                    // TODO update plan api function
                    // return await updatePlan(data)
                },
                productDetails,
                manageSubscriptionHref: `/board/site/${siteId}/settings`,
                onCheckout(arg) {
                    router.push(`/board/site/${siteId}`)
                    onCheckout && onCheckout(arg)
                },
                ...rest,
            }}
        />
    )
}

export function LoginLink({}) {
    const { status } = useSession()
    const router = useRouter()
    return (
        <div key={status} className='max-w-[14ch] text-left md:text-center'>
            {status === 'authenticated' ? (
                <Link onClick={() => router.push('/board')}>
                    Go to Dashboard
                </Link>
            ) : (
                <Link
                    data-name='login'
                    onClick={() =>
                        signIn(
                            undefined,
                            {
                                callbackUrl: '/board',
                                redirect: true,
                            },
                            { prompt: 'select_account' },
                        )
                    }
                >
                    Login or Sign Up
                </Link>
            )}
        </div>
    )
}

export function LogoIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns='http://www.w3.org/2000/svg'
            xmlnsXlink='http://www.w3.org/1999/xlink'
            width='1em'
            height='1em'
            viewBox='0 0 24 24'
            {...props}
        >
            <path
                fill='currentColor'
                d='M13 8V4q0-.425.288-.713Q13.575 3 14 3h6q.425 0 .712.287Q21 3.575 21 4v4q0 .425-.288.712Q20.425 9 20 9h-6q-.425 0-.712-.288Q13 8.425 13 8ZM3 12V4q0-.425.288-.713Q3.575 3 4 3h6q.425 0 .713.287Q11 3.575 11 4v8q0 .425-.287.712Q10.425 13 10 13H4q-.425 0-.712-.288Q3 12.425 3 12Zm10 8v-8q0-.425.288-.713Q13.575 11 14 11h6q.425 0 .712.287q.288.288.288.713v8q0 .425-.288.712Q20.425 21 20 21h-6q-.425 0-.712-.288Q13 20.425 13 20ZM3 20v-4q0-.425.288-.713Q3.575 15 4 15h6q.425 0 .713.287q.287.288.287.713v4q0 .425-.287.712Q10.425 21 10 21H4q-.425 0-.712-.288Q3 20.425 3 20Z'
            ></path>
        </svg>
    )
}
