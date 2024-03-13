export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import { Roboto } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import Providers from '@/redux/provider'

import './globals.css'
import { Header } from '@/components'
import { ToasterProvider } from '@/providers'
import getCurrentUser from './actions/current-user'
import { SidebarProvider } from '../../context/sidebar'

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

    return (
        <html lang="en">
            <body className={roboto.className}>
                <Providers>
                    <SidebarProvider>
                        <ToasterProvider />
                        <Header currentUser={currentUser} />
                        {children}
                        <Analytics />
                        <SpeedInsights />
                    </SidebarProvider>
                </Providers>
            </body>
        </html>
    )
}
