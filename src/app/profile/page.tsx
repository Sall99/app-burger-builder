import { ProfileSideBar, UpdateProfileForm } from '@/components/ui'
import React from 'react'

export default function Profile() {
    return (
        <div className="flex">
            <div>
                {' '}
                <ProfileSideBar />
            </div>
            <div className="pl-60 mt-9">
                <UpdateProfileForm />
            </div>
        </div>
    )
}
