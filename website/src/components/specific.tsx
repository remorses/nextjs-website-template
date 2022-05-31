import { Header } from 'beskar/src/Header'
import { Footer, Link } from 'beskar/landing'

export function MyHeader({}) {
    return (
        <Header
            links={[
                <Link href='/docs'>Docs</Link>,
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
