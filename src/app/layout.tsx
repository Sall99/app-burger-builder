import type { Metadata } from 'next'
import { Roboto } from 'next/font/google'

import Providers from '@/redux/provider'

import './globals.css'
import { Header } from '@/components'
import { ToasterProvider } from '@/providers'
import getCurrentUser from './actions/current-user'

const roboto = Roboto({
    weight: ['400', '500', '700', '900'],
    subsets: ['latin']
})

export const metadata: Metadata = {
    title: 'Burger Builder, the best burger in town!',
    description: 'Burger Builder, the best burger in town!'
}

type Props = {
    children: React.ReactNode
}

export default async function RootLayout({ children }: Props) {
    const currentUser = await getCurrentUser()

    console.log(currentUser)

    return (
        <html lang="en">
            <body className={roboto.className}>
                <Providers>
                    <ToasterProvider />
                    <Header currentUser={currentUser} />
                    {children}
                </Providers>
            </body>
        </html>
    )
}
