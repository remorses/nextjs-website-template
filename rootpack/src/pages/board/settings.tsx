import { Button } from '@chakra-ui/react'
import { Block } from 'beskar/dashboard'
import { useThrowingFn } from 'beskar/landing'
import { signOut, useSession } from 'next-auth/react'
import { deleteUser } from '../api/functions'

export default function Page() {
    const { data: session } = useSession()
    const { fn: deleteUserClient, isLoading } = useThrowingFn({
        async fn() {
            const ok = confirm(
                'Are you sure you want to delete your account?\nAll sites where you are the admin will be deleted.',
            )
            if (!ok) {
                throw Object.assign(new Error(`canceled`), { skipToast: true })
            }
            console.log('deleting user')

            await deleteUser()
            await signOut({ callbackUrl: '/' })
        },
        successMessage: 'User deleted',
    })
    return (
        <div className='space-y-8'>
            <div className='font-semibold'>User Data</div>
            <Block>
                <div className='font-semibold'>Your Email</div>
                <div>{session?.user?.email || ''}</div>
            </Block>
            <div className='font-semibold'>Delete User</div>
            <Block>
                <div className='space-y-8'>
                    <Button
                        colorScheme='red'
                        // ml='-3'
                        isLoading={isLoading}
                        variant='ghost'
                        aria-label='delete user'
                        onClick={deleteUserClient}
                    >
                        Delete account
                    </Button>
                </div>
            </Block>
        </div>
    )
}
