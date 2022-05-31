import { CogIcon, FolderIcon } from '@heroicons/react/solid'
import { TabLink } from 'beskar/src/Tabs'
import { Alert, TableBlock } from 'beskar/dashboard'
import { useRouter } from 'next/router'

function Page({}) {
    return (
        <>
            <Alert
                // type='error'
                description='Hello'
                title={'Hello, happy to see you'}
                className=''
            ></Alert>
            <TableBlock
                head={['ciao']}
                rows={[['xxx']]}
                className=''
            ></TableBlock>
        </>
    )
}

export const Tabs = () => {
    const {
        query: { orgId },
    } = useRouter()
    const base = `/org/${orgId}`

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
