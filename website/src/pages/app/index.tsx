import { CogIcon, FolderIcon } from '@heroicons/react/outline'
import { TabLink } from 'beskar/src/Tabs'
import { useRouter } from 'next/router'

function Page({}) {
    return null
}

export const Tabs = () => {
    const {
        query: { orgId },
    } = useRouter()
    // const base = `/org/${orgId}`
    const base = `/app`
    return [
        <TabLink
            key='1'
            aria-label=''
            href={base}
            icon={<FolderIcon className='w-5 h-5' />}
        >
            Campaigns
        </TabLink>,
        <TabLink
            key='2'
            aria-label=''
            href={`${base}/settings`}
            icon={<CogIcon className='w-5 h-5' />}
        >
            Settings
        </TabLink>,
    ]
}

Page.Tabs = Tabs

export default Page
