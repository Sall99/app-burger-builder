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
import { TawkChatWithUser } from '@/components/chat'
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
            'Build Your Own Burger',
            'Build a Burger Online',
            'Order Burger Online',
            'Burger Near Me',
            'Burger Delivery',
            'Gourmet Burger',
            'Interactive Food Ordering',
            'Best Burger in Town',
            'Fresh Burger Ingredients',
            'Fast Food Online',
            'Online Food Ordering',
            'Food Delivery App',
            'Burger Restaurant',
            'Custom Hamburger',
            'Create Your Burger',
            'Design Your Burger',
            'Burger Menu Online',
            'Best Burger App'
        ],
        verification: {
            google: 'wl3JxJ5o6Fls3aR5fEDCg3Y4TMnvnzW_BcFid2DWSL0',
            yandex: 'yandex-verification-code',
            yahoo: 'yahoo-verification-code'
        },
        alternates: {
            canonical: 'https://app-burger-builder.vercel.app',
            languages: {
                en: 'https://app-burger-builder.vercel.app/en',
                fr: 'https://app-burger-builder.vercel.app/fr',
                'x-default': 'https://app-burger-builder.vercel.app'
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
        category: 'Food & Drink'
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
                    url: 'https://app-burger-builder.vercel.app/images/Logo.png',
                    width: 512,
                    height: 512
                },
                description:
                    'Burger Builder is the interactive online burger customizer. Build your perfect custom burger with premium fresh ingredients and get it delivered fast.'
            },
            {
                '@type': 'WebSite',
                '@id': 'https://app-burger-builder.vercel.app/#website',
                url: 'https://app-burger-builder.vercel.app',
                name: 'Burger Builder',
                description:
                    'Interactive online burger builder — customize your perfect burger with fresh ingredients and order delivery.',
                publisher: {
                    '@id': 'https://app-burger-builder.vercel.app/#organization'
                },
                inLanguage: ['en', 'fr']
            },
            {
                '@type': 'Restaurant',
                '@id': 'https://app-burger-builder.vercel.app/#restaurant',
                name: 'Burger Builder',
                image: [
                    'https://app-burger-builder.vercel.app/og-image.jpg',
                    'https://app-burger-builder.vercel.app/og-image-square.jpg'
                ],
                url: 'https://app-burger-builder.vercel.app',
                description:
                    'Build your perfect custom burger online with fresh premium ingredients. Order delivery or pickup today!',
                servesCuisine: ['American', 'Fast Food', 'Burgers', 'Gourmet Burgers'],
                priceRange: '$$',
                acceptsReservations: false,
                menu: 'https://app-burger-builder.vercel.app',
                aggregateRating: {
                    '@type': 'AggregateRating',
                    ratingValue: '4.8',
                    reviewCount: '312',
                    bestRating: '5',
                    worstRating: '1'
                },
                hasMenu: {
                    '@type': 'Menu',
                    name: 'Custom Burger Menu',
                    hasMenuSection: [
                        {
                            '@type': 'MenuSection',
                            name: 'Custom Burgers',
                            hasMenuItem: [
                                {
                                    '@type': 'MenuItem',
                                    name: 'Classic Custom Burger',
                                    description:
                                        'Build your own burger with a fresh beef patty, lettuce, cheese, and your choice of toppings',
                                    offers: {
                                        '@type': 'Offer',
                                        price: '4.00',
                                        priceCurrency: 'USD',
                                        availability: 'https://schema.org/InStock'
                                    }
                                },
                                {
                                    '@type': 'MenuItem',
                                    name: 'Bacon Burger',
                                    description:
                                        'Juicy beef patty topped with crispy smoked bacon, melted cheddar cheese, and fresh lettuce',
                                    offers: {
                                        '@type': 'Offer',
                                        price: '5.30',
                                        priceCurrency: 'USD',
                                        availability: 'https://schema.org/InStock'
                                    }
                                },
                                {
                                    '@type': 'MenuItem',
                                    name: 'Cheese Burger',
                                    description:
                                        'Classic cheeseburger with a premium beef patty, aged cheddar cheese, and fresh toppings',
                                    offers: {
                                        '@type': 'Offer',
                                        price: '5.00',
                                        priceCurrency: 'USD',
                                        availability: 'https://schema.org/InStock'
                                    }
                                },
                                {
                                    '@type': 'MenuItem',
                                    name: 'Gourmet Burger',
                                    description:
                                        'The ultimate custom gourmet burger — beef patty, bacon, double cheese, and fresh garden salad',
                                    offers: {
                                        '@type': 'Offer',
                                        price: '6.60',
                                        priceCurrency: 'USD',
                                        availability: 'https://schema.org/InStock'
                                    }
                                }
                            ]
                        }
                    ]
                }
            },
            {
                '@type': 'BreadcrumbList',
                '@id': 'https://app-burger-builder.vercel.app/#breadcrumb',
                itemListElement: [
                    {
                        '@type': 'ListItem',
                        position: 1,
                        name: 'Home',
                        item: 'https://app-burger-builder.vercel.app'
                    },
                    {
                        '@type': 'ListItem',
                        position: 2,
                        name: 'Build Your Burger',
                        item: 'https://app-burger-builder.vercel.app/en'
                    },
                    {
                        '@type': 'ListItem',
                        position: 3,
                        name: 'Locations',
                        item: 'https://app-burger-builder.vercel.app/en/locations'
                    },
                    {
                        '@type': 'ListItem',
                        position: 4,
                        name: 'Help & FAQ',
                        item: 'https://app-burger-builder.vercel.app/en/help'
                    }
                ]
            }
        ]
    }

    return (
        <html lang={locale}>
            <head>
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

                {process.env.NEXT_PUBLIC_TAWK_PROPERTY_ID && (
                    <TawkChatWithUser
                        propertyId={process.env.NEXT_PUBLIC_TAWK_PROPERTY_ID}
                        widgetId={process.env.NEXT_PUBLIC_TAWK_WIDGET_ID}
                        userEmail={session?.user?.email || undefined}
                        userName={session?.user?.name || undefined}
                    />
                )}
            </body>
        </html>
    )
}
