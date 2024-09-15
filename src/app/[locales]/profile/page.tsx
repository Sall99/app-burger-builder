import { Metadata } from 'next'

import { UpdateProfileForm } from '@/components/ui'

export const metadata: Metadata = {
    title: 'Profile',
    description: 'Manage your account'
}
export default function Profile() {
    return (
        <section className="px-16 mt-16">
            <UpdateProfileForm />
        </section>
    )
}
