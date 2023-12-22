import type { Metadata } from 'next'
import { Roboto } from 'next/font/google'
import { cookies } from 'next/headers'

import Providers from '@/redux/provider'

import './globals.css'
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
    const nextCookes = cookies()
    let userPrefferedLang = nextCookes.get('NEXT_LOCALE')?.value ?? lang

    if (!userPrefferedLang) {
        userPrefferedLang = lang
    }

    return (
        <html lang={userPrefferedLang}>
            <body className={roboto.className}>
                <Providers>
                    {' '}
                    <Header lang={lang} />
                    {children}
                </Providers>
            </body>
        </html>
    )
}
