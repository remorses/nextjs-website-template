import { CogIcon, FolderIcon } from '@heroicons/react/outline'
import { TabLink } from 'beskar/src/Tabs'
import { Alert, Block, TableBlock } from 'beskar/dashboard'
import { Button } from 'beskar/landing'
import { useRouter } from 'next/router'
import { Tabs } from './index'

function Page({}) {
    return (
        <Alert
            title='Coming Soon'
            description='You will be able to connect your own domain'
            className=''
        />
    )
}

Page.Tabs = Tabs

export default Page
