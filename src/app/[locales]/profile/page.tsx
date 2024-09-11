'use client'

import { Help, ProfileSideBar, UpdateProfileForm } from '@/components/ui'
import { useSidebar } from '../../../../context'

interface ComponentsType {
    [key: string]: JSX.Element
}

const Components: ComponentsType = {
    Profile: <UpdateProfileForm />,
    Help: <Help />
}

export default function Profile() {
    const { clickedLink } = useSidebar()

    const activeComponent = clickedLink ? Components[clickedLink] : null

    return (
        <div className="flex">
            <div>
                {' '}
                <ProfileSideBar />
            </div>
            <div className="pl-96 mt-9">{activeComponent}</div>
        </div>
    )
}
