import type { Metadata } from 'next'
import { Roboto } from 'next/font/google'
import './globals.css'
import React from 'react'
import { Header } from '@/components'

const roboto = Roboto({
    weight: ['400', '500', '700', '900'],
    subsets: ['latin']
})

export const metadata: Metadata = {
    title: 'Burger Builder, the best burger in town!',
    description: 'Burger Builder, the best burger in town!'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className={roboto.className}>
                <Header />
                {children}
            </body>
        </html>
    )
}
