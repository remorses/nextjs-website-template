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

import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { AvatarButton } from 'beskar/src/Header'
import { DropDownMenu } from 'beskar/src/DropDown'
import { SelectSite } from './SelectSite'
import { getSubscription } from '@app/pages/api/functions'

export function MyHeader({}) {
    return (
        <DashboardHeader
            logo={
                <div className='flex flex-col gap-3'>
                    <Logo />
                    <SelectSite />
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

export function Logo({}) {
    // const { status } = useSession()
    return (
        <NextLink href={'/'} passHref>
            <a className='text-2xl font-semibold '>RootPack</a>
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
