export const dynamic = 'force-dynamic';

import React from 'react';
import { GoogleTagManager } from '@next/third-parties/google';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import { getServerSession } from 'next-auth';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';

import { Header } from '@/components';
import { ToasterProvider } from '@/providers';
import Providers from '@/redux/provider';

import { SidebarProvider } from '../../../context/sidebar';
import { authOptions } from '../../../libs';

import './globals.css';

const roboto = Roboto({
    weight: ['400', '500', '700', '900'],
    subsets: ['latin']
});

export const metadata: Metadata = {
    robots: { index: false, follow: false },
    title: 'Burger Builder, the best burger in town!',
    description: 'Burger Builder, the best burger in town!',
    verification: { google: 'wl3JxJ5o6Fls3aR5fEDCg3Y4TMnvnzW_BcFid2DWSL0' }
};

type Props = {
    children: React.ReactNode
}

export default async function RootLayout({ children }: Props) {
    const messages = await getMessages();
    const locale = await getLocale();
    const session = await getServerSession(authOptions);
    return (
        <html lang={locale}>
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
    );
}
