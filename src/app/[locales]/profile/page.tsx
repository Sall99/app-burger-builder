'use client'

import { UpdateProfileForm } from '@/components/ui'

interface ComponentsType {
    [key: string]: JSX.Element
}

export default function Profile() {
    return (
        <section className="px-16 mt-16">
            <UpdateProfileForm />
        </section>
    )
}
