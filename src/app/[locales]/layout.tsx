import React from 'react'
import { GoogleTagManager } from '@next/third-parties/google'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import type { Metadata } from 'next'
import { Roboto } from 'next/font/google'
import { getServerSession } from 'next-auth'
import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getMessages, getTranslations } from 'next-intl/server'

import { WebVitals } from '@/app/web-vitals'
import { Footer, Header } from '@/components'
import { CrispChatWithUser } from '@/components/chat'
import { GoogleAnalytics } from '@/components/google'
import { SkipLink } from '@/components/ui'
import { ToasterProvider } from '@/providers'
import Providers from '@/redux/provider'

import { authOptions, SessionWrapper } from '../../../libs'

import './globals.css'

const roboto = Roboto({
    weight: ['400', '500', '700', '900'],
    subsets: ['latin']
})

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations('Pages.Layout')

    return {
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                'max-video-preview': -1,
                'max-image-preview': 'large',
                'max-snippet': -1
            }
        },
        metadataBase: new URL('https://app-burger-builder.vercel.app'),
        title: t('title'),
        description: t('description'),
        keywords: [
            'Burger Builder',
            'Custom Burgers',
            'Gourmet Burgers',
            'Interactive Food Ordering',
            'Best Burger in Town',
            'Fresh Ingredients',
            'Fast Food',
            'Restaurant'
        ],
        verification: {
            google: 'wl3JxJ5o6Fls3aR5fEDCg3Y4TMnvnzW_BcFid2DWSL0',
            yandex: 'yandex-verification-code',
            yahoo: 'yahoo-verification-code'
        },
        alternates: {
            canonical: 'https://app-burger-builder.vercel.app',
            languages: {
                'en-US': 'https://app-burger-builder.vercel.app/en-US',
                'es-ES': 'https://app-burger-builder.vercel.app/es-ES'
            }
        },
        openGraph: {
            type: 'website',
            url: 'https://app-burger-builder.vercel.app/',
            title: 'Burger Builder - Create Your Perfect Custom Burger | Best in Town',
            description:
                'Design your dream burger with our interactive Burger Builder. Choose from premium, fresh ingredients to create a mouthwatering masterpiece. Fast, fun, and delicious!',
            images: [
                {
                    url: 'https://app-burger-builder.vercel.app/og-image.jpg',
                    width: 1200,
                    height: 630,
                    alt: 'Burger Builder - Custom Gourmet Burgers'
                },
                {
                    url: 'https://app-burger-builder.vercel.app/og-image-square.jpg',
                    width: 800,
                    height: 800,
                    alt: 'Burger Builder Logo'
                }
            ],
            siteName: 'Burger Builder',
            locale: 'en_US'
        },
        twitter: {
            card: 'summary_large_image',
            site: '@BurgerBuilderApp',
            creator: '@BurgerBuilderApp',
            title: 'Burger Builder - Create Your Perfect Custom Burger | Best in Town',
            description:
                'Design your dream burger with our interactive Burger Builder. Choose from premium, fresh ingredients!',
            images: ['https://app-burger-builder.vercel.app/twitter-image.jpg']
        },
        authors: [{ name: 'Burger Builder Team' }],
        category: 'Food & Drink',
        other: {
            'fb:app_id': '123456789',
            'og:price:amount': '9.99',
            'og:price:currency': 'USD'
        }
    }
}

type Props = {
    children: React.ReactNode
}

export default async function RootLayout({ children }: Props) {
    const messages = await getMessages()
    const locale = await getLocale()
    const session = await getServerSession(authOptions)
    const t = await getTranslations('Accessibility')

    const schemaOrgData = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'Organization',
                '@id': 'https://app-burger-builder.vercel.app/#organization',
                name: 'Burger Builder',
                url: 'https://app-burger-builder.vercel.app',
                logo: {
                    '@type': 'ImageObject',
                    url: 'https://app-burger-builder.vercel.app/images/Logo.png'
                },
                sameAs: [
                    'https://facebook.com/burgerbuilder',
                    'https://twitter.com/burgerbuilder',
                    'https://instagram.com/burgerbuilder'
                ]
            },
            {
                '@type': 'WebSite',
                '@id': 'https://app-burger-builder.vercel.app/#website',
                url: 'https://app-burger-builder.vercel.app',
                name: 'Burger Builder',
                description: 'Build your perfect burger with our interactive burger builder',
                publisher: {
                    '@id': 'https://app-burger-builder.vercel.app/#organization'
                },
                inLanguage: ['en', 'fr'],
                potentialAction: {
                    '@type': 'SearchAction',
                    target: {
                        '@type': 'EntryPoint',
                        urlTemplate:
                            'https://app-burger-builder.vercel.app/search?q={search_term_string}'
                    },
                    'query-input': 'required name=search_term_string'
                }
            },
            {
                '@type': 'Restaurant',
                '@id': 'https://app-burger-builder.vercel.app/#restaurant',
                name: 'Burger Builder',
                image: 'https://app-burger-builder.vercel.app/images/Logo.png',
                url: 'https://app-burger-builder.vercel.app',
                servesCuisine: 'American, Fast Food, Burgers',
                priceRange: '$$',
                acceptsReservations: false,
                menu: 'https://app-burger-builder.vercel.app',
                hasMenu: {
                    '@type': 'Menu',
                    hasMenuItem: [
                        {
                            '@type': 'MenuItem',
                            name: 'Custom Burger',
                            description: 'Build your own burger with premium ingredients',
                            offers: {
                                '@type': 'Offer',
                                price: '4.00',
                                priceCurrency: 'USD'
                            }
                        }
                    ]
                }
            }
        ]
    }

    return (
        <html lang={locale}>
            <head>
                <link rel="canonical" href="https://app-burger-builder.vercel.app" />
                <link rel="manifest" href="/manifest.json" />
                <meta name="theme-color" content="#f59e0b" />
                <meta name="mobile-web-app-capable" content="yes" />
                <meta name="apple-mobile-web-app-capable" content="yes" />
                <meta name="apple-mobile-web-app-status-bar-style" content="default" />
                <meta name="apple-mobile-web-app-title" content="Burger Builder" />
                <link rel="apple-touch-icon" href="/images/Logo.png" />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrgData) }}
                />
            </head>
            <body className={roboto.className}>
                <SessionWrapper>
                    <Providers>
                        <SkipLink text={t('skipToMain')} />
                        <WebVitals />
                        <ToasterProvider />
                        <GoogleTagManager gtmId={'G-ZM99W2R4EX'} />
                        <NextIntlClientProvider messages={messages}>
                            <Header session={session} />
                            <main id="main-content" tabIndex={-1}>
                                {children}
                            </main>
                            <Footer />
                        </NextIntlClientProvider>
                        <Analytics />
                        <SpeedInsights />
                    </Providers>
                </SessionWrapper>
                <GoogleAnalytics />
                {/* Live Chat Support */}
                {process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID && (
                    <CrispChatWithUser
                        websiteId={process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID}
                        userEmail={session?.user?.email || undefined}
                        userName={session?.user?.name || undefined}
                    />
                )}
            </body>
        </html>
    )
}
