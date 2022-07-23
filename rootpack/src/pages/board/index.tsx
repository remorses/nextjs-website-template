import { getSiteLimits, requiresAuth } from '@app/utils/ssr'
import { Spinner } from 'beskar/landing'
import { prisma } from 'db'

export default function Page() {
    return (
        <div className='flex flex-col items-center justify-center min-h-[300px]'>
            <Spinner className='text-6xl' />
        </div>
    )
}
