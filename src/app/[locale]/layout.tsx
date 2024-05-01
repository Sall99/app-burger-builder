export const dynamic = 'force-dynamic'

import type { GetServerSideProps, Metadata } from 'next'
import { Roboto } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import Providers from '@/redux/provider'
import { NextIntlClientProvider, useMessages } from 'next-intl'
import { ToasterProvider } from '@/providers'
import { GoogleTagManager } from '@next/third-parties/google'

import './globals.css'
import { Header } from '@/components'
import getCurrentUser from '../actions/current-user'
import { SidebarProvider } from '../../../context/sidebar'
import { SafeUser } from '@/types'

const roboto = Roboto({
    weight: ['400', '500', '700', '900'],
    subsets: ['latin']
})

export const metadata: Metadata = {
    robots: { index: false, follow: false },
    title: 'Burger Builder, the best burger in town!',
    description: 'Burger Builder, the best burger in town!',
    verification: { google: 'wl3JxJ5o6Fls3aR5fEDCg3Y4TMnvnzW_BcFid2DWSL0' }
}

type Props = {
    children: React.ReactNode
    params: { locale: string }
    currentUser: SafeUser | null
}

export default function RootLayout({ children, params: { locale }, currentUser }: Props) {
    const messages = useMessages()
    return (
        <html lang={locale}>
            <body className={roboto.className}>
                <Providers>
                    <SidebarProvider>
                        <ToasterProvider />
                        <GoogleTagManager gtmId={'G-ZM99W2R4EX'} />
                        <NextIntlClientProvider messages={messages}>
                            <Header currentUser={currentUser} />
                            {children}
                        </NextIntlClientProvider>
                        <Analytics />
                        <SpeedInsights />
                    </SidebarProvider>
                </Providers>
            </body>
        </html>
    )
}

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
    const currentUser = await getCurrentUser()
    return {
        props: {
            currentUser,
            params: { locale }
        }
    }
}
