import { Metadata } from 'next'

import Content from './content'

export const metadata: Metadata = {
    title: 'Profile',
    description: 'Manage your account'
}
export default function Profile() {
    return <Content />
}
