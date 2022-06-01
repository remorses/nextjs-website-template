import { MyFooter } from '@app/components/specific'
import {
    Hero,
    Divider,
    TestimonialLogos,
    Feature,
    NavBar,
    Link,
    GradientRect,
    Button,
    PageContainer,
    Section,
    FeatureLink,
    getColor,
} from 'beskar/landing'
import Image from 'next/image'
import img1 from '@app/../public/board.png'
import img2 from '@app/../public/power-ups.png'
import img3 from '@app/../public/automation.png'
import { signIn } from 'next-auth/react'

export default function Component() {
    return (
        <div className='dark  space-y-8 bg-gray-900 text-gray-200 min-h-screen w-full flex flex-col items-stretch'>
            <NavBar
                logo={<p className='text-3xl font-medium'>Kimaki</p>}
                navs={[
                    <Link href=''>Docs</Link>,
                    <Link href=''>Changelog</Link>, //
                ]}
            />
            <Hero
                bullet='Beta'
                heading='1Password for env variables'
                subheading='1Password for env variables'
                className=''
                image={<Image className='!p-20 !pr-0' src={img1} />}
                cta={
                    <Button
                        onClick={() => {
                            signIn('google', { callbackUrl: '/' })
                        }}
                        // className='text-sm'
                        biggerOnHover
                        bg='blue.500'
                    >
                        Get Started with Google
                    </Button>
                }
                floatingElement={<GradientRect />}
            />
            <Divider heading='Amazing features' />
            {/* <TestimonialLogos /> */}
            <Feature
                bullet='feature'
                heading='Amazing feature'
                subheading='Very amazing'
                cta={<FeatureLink>Try iy</FeatureLink>}
                image={<Image className='!p-20' src={img2} />}
            />
            <Section bg={getColor('neutral.800')} className='py-8' degree={2}>
                <Feature
                    flip
                    className='py-8'
                    bullet='feature'
                    heading='Amazing feature'
                    subheading='Notaku allows you to setup a blog website with your own domain and your own Notion content.'
                    cta={<FeatureLink>Try it now</FeatureLink>}
                    image={<Image className='!p-10' src={img3} />}
                />
            </Section>
            <div className='flex-auto'></div>

            <PageContainer className=''>
                <MyFooter />
            </PageContainer>
        </div>
    )
}
