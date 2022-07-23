import { CogIcon, FolderIcon } from '@heroicons/react/outline'
import { TabLink } from 'beskar/src/Tabs'
import { Block, TableBlock } from 'beskar/dashboard'
import { Button } from 'beskar/landing'
import { useRouter } from 'next/router'
import { Tabs } from './index'

function Page({}) {
    return (
        <Block>
            <div className=''>Hello</div>
            <Button className='self-end text-sm'>Click</Button>
        </Block>
    )
}

Page.Tabs = Tabs

export default Page
