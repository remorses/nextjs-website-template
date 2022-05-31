import NextLink from 'next/link'
import { Header } from 'beskar/src/Header'
import { Footer, Link, useColorMode, useColorModeValue } from 'beskar/landing'
import {
    MoonIcon,
    SunIcon,
    CogIcon,
    LogoutIcon,
    CreditCardIcon,
} from '@heroicons/react/outline'
import { Avatar } from '@nextui-org/react'
import { DropDownMenu } from 'beskar/src/DropDown'
import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { AvatarButton } from 'beskar/src/Header'

export function MyHeader({}) {
    return (
        <Header
            logo={<Logo />}
            links={[
                <Link href='/docs'>Docs</Link>,
                <AvatarMenu />,
                //
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
    const orgId = router.query.orgId
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
            <NextLink href={`/org/${orgId}/settings`}>
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
    const { status } = useSession()
    return (
        <NextLink href={status === 'authenticated' ? '/org' : '/'} passHref>
            <a className='text-xl font-semibold '>Replicant</a>
        </NextLink>
    )
}
