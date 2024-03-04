'use client'
import { ProfileSideBar, UpdateProfileForm } from '@/components/ui'
import { selectCurrentUser } from '@/redux/selectors/current-user'
import { useSelector } from 'react-redux'

export default function Profile() {
    const currentUser = useSelector(selectCurrentUser) as any
    return (
        <div className="flex">
            <div>
                {' '}
                <ProfileSideBar />
            </div>
            <div className="pl-96 mt-9">
                <h1 className="text-xl font-semibold mb-16 text-zinc-600">
                    <p className="flex gap-1 items-center font-normal">
                        <span>Hi</span>
                        <span className="font-bold underline">{currentUser?.name}</span>
                        <span>, please take a moment to update your profile.</span>
                    </p>
                </h1>
                <UpdateProfileForm />
            </div>
        </div>
    )
}
