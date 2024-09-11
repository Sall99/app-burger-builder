export const dynamic = 'force-dynamic'

import React from 'react'
import { GoogleTagManager } from '@next/third-parties/google'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import type { Metadata } from 'next'
import { Roboto } from 'next/font/google'
import { getServerSession } from 'next-auth'
import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getMessages } from 'next-intl/server'

import { Header } from '@/components'
import { ToasterProvider } from '@/providers'
import Providers from '@/redux/provider'

import { SidebarProvider } from '../../../context/sidebar'
import { authOptions } from '../../../libs'

import './globals.css'

const roboto = Roboto({
    weight: ['400', '500', '700', '900'],
    subsets: ['latin']
})

export const metadata: Metadata = {
    robots: { index: true, follow: true },
    metadataBase: new URL('http://localhost:3000'),
    title: 'Burger Builder - The Best Burger in Town!',
    description:
        'Build your perfect burger with our easy-to-use Burger Builder. Choose from a variety of fresh ingredients and create a masterpiece!',
    keywords: ['Burger Builder', 'Best Burger', 'Custom Burgers', 'Food', 'Restaurant'],
    verification: { google: 'wl3JxJ5o6Fls3aR5fEDCg3Y4TMnvnzW_BcFid2DWSL0' },
    openGraph: {
        type: 'website',
        url: 'https://app-burger-builder.vercel.app/',
        title: 'Burger Builder - The Best Burger in Town!',
        description:
            'Build your perfect burger with our easy-to-use Burger Builder. Choose from a variety of fresh ingredients and create a masterpiece!',
        images: [
            {
                url: 'https://app-burger-builder.vercel.app/og-image.jpg',
                width: 800,
                height: 600,
                alt: 'Burger Builder'
            }
        ]
    },
    twitter: {
        card: 'summary_large_image',
        site: '@YourTwitterHandle',
        title: 'Burger Builder - The Best Burger in Town!',
        description: 'Build your perfect burger with our easy-to-use Burger Builder.'
    }
}

type Props = {
    children: React.ReactNode
}

export default async function RootLayout({ children }: Props) {
    const messages = await getMessages()
    const locale = await getLocale()
    const session = await getServerSession(authOptions)

    const schemaOrgData = {
        '@context': 'http://schema.org',
        '@type': 'Restaurant',
        url: 'https://app-burger-builder.vercel.app',
        name: 'Burger Builder',
        description: 'Build your perfect burger with our easy-to-use Burger Builder.',
        publisher: {
            '@type': 'Organization',
            name: 'Sall99'
        }
    }

    return (
        <html lang={locale}>
            <head>
                <link rel="canonical" href="https://app-burger-builder.vercel.app" />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrgData) }}
                />
            </head>
            <body className={roboto.className}>
                <Providers>
                    <SidebarProvider>
                        <ToasterProvider />
                        <GoogleTagManager gtmId={'G-ZM99W2R4EX'} />
                        <NextIntlClientProvider messages={messages}>
                            <Header session={session} />
                            <main>{children}</main>
                        </NextIntlClientProvider>
                        <Analytics />
                        <SpeedInsights />
                    </SidebarProvider>
                </Providers>
            </body>
        </html>
    )
}
