import type { Metadata } from 'next'
import { Roboto } from 'next/font/google'
import './globals.css'
import React from 'react'
import { Header } from '@/components'
import { locales } from '@/i18n'

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
    params: {
        lang: locales
    }
}

export default function RootLayout({ children, params: { lang } }: Props) {
    return (
        <html lang={lang}>
            <body className={roboto.className}>
                <Header />
                {children}
            </body>
        </html>
    )
}
