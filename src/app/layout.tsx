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
    robots: { index: false, follow: false },
    title: 'Burger Builder, the best burger in town!',
    description: 'Burger Builder, the best burger in town!',
    verification: { google: 'wl3JxJ5o6Fls3aR5fEDCg3Y4TMnvnzW_BcFid2DWSL0' }
}

type Props = {
    children: React.ReactNode
}

export default async function RootLayout({ children }: Props) {
    const currentUser = await getCurrentUser()

    return (
        <html lang="en">
            {/* Google Tag Manager */}
            <script>{`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-MFHJ9JVT');`}</script>
            {/* End Google Tag Manager */}
            <body className={roboto.className}>
                {/* <!-- Google Tag Manager (noscript) --> */}
                <noscript>
                    <iframe
                        src="https://www.googletagmanager.com/ns.html?id=GTM-MFHJ9JVT"
                        height="0"
                        width="0"
                        style={{ display: 'none', visibility: 'hidden' }}></iframe>
                </noscript>
                {/* <!-- End Google Tag Manager (noscript) --> */}
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
