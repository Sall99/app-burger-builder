import { Metadata } from 'next'

import { seoConfig } from '@/config/seo'

interface GenerateMetadataProps {
    title?: string
    description?: string
    keywords?: string
    image?: string
    url?: string
    type?: 'website' | 'article'
    locale?: string
    noIndex?: boolean
}

export function generateMetadata({
    title = seoConfig.defaultTitle,
    description = seoConfig.defaultDescription,
    keywords,
    image = `${seoConfig.siteUrl}/images/og-image.png`,
    url = seoConfig.siteUrl,
    type = 'website',
    locale = seoConfig.defaultLocale,
    noIndex = false
}: GenerateMetadataProps = {}): Metadata {
    const fullTitle = title.includes(seoConfig.siteName)
        ? title
        : `${title} | ${seoConfig.siteName}`

    const keywordsList = keywords || seoConfig.keywords.join(', ')

    return {
        metadataBase: new URL(seoConfig.siteUrl),
        title: fullTitle,
        description,
        keywords: keywordsList,
        authors: [{ name: seoConfig.author }],
        creator: seoConfig.author,
        publisher: seoConfig.siteName,
        robots: noIndex
            ? {
                  index: false,
                  follow: false
              }
            : {
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
        alternates: {
            canonical: url,
            languages: {
                en: `${seoConfig.siteUrl}/en`,
                fr: `${seoConfig.siteUrl}/fr`
            }
        },
        openGraph: {
            type,
            locale,
            url,
            title: fullTitle,
            description,
            siteName: seoConfig.siteName,
            images: [
                {
                    url: image,
                    width: 1200,
                    height: 630,
                    alt: fullTitle
                }
            ]
        },
        twitter: {
            card: 'summary_large_image',
            site: seoConfig.twitterHandle,
            creator: seoConfig.twitterHandle,
            title: fullTitle,
            description,
            images: [image]
        },
        verification: {
            google: 'your-google-site-verification-code',
            yandex: 'your-yandex-verification-code'
        },
        category: 'food & dining'
    }
}

export function generateJsonLd(
    type: 'Organization' | 'WebSite' | 'Product' | 'Restaurant',
    data?: any
) {
    const baseJsonLd = {
        '@context': 'https://schema.org'
    }

    switch (type) {
        case 'Organization':
            return {
                ...baseJsonLd,
                '@type': 'Organization',
                name: seoConfig.siteName,
                url: seoConfig.siteUrl,
                logo: `${seoConfig.siteUrl}/images/Logo.png`,
                description: seoConfig.defaultDescription,
                sameAs: [
                    seoConfig.social.twitter,
                    seoConfig.social.facebook,
                    seoConfig.social.instagram
                ],
                contactPoint: {
                    '@type': 'ContactPoint',
                    telephone: '+1-XXX-XXX-XXXX',
                    contactType: 'Customer Service',
                    availableLanguage: ['English', 'French']
                }
            }

        case 'WebSite':
            return {
                ...baseJsonLd,
                '@type': 'WebSite',
                name: seoConfig.siteName,
                url: seoConfig.siteUrl,
                description: seoConfig.defaultDescription,
                potentialAction: {
                    '@type': 'SearchAction',
                    target: `${seoConfig.siteUrl}/search?q={search_term_string}`,
                    'query-input': 'required name=search_term_string'
                },
                inLanguage: ['en', 'fr']
            }

        case 'Restaurant':
            return {
                ...baseJsonLd,
                '@type': 'Restaurant',
                name: seoConfig.siteName,
                image: `${seoConfig.siteUrl}/images/Logo.png`,
                url: seoConfig.siteUrl,
                telephone: '+1-XXX-XXX-XXXX',
                servesCuisine: 'American, Fast Food, Burgers',
                priceRange: '$$',
                acceptsReservations: false,
                address: {
                    '@type': 'PostalAddress',
                    streetAddress: 'Your Street Address',
                    addressLocality: 'Your City',
                    addressRegion: 'Your State',
                    postalCode: 'Your ZIP',
                    addressCountry: 'US'
                },
                menu: `${seoConfig.siteUrl}/menu`,
                orderAction: {
                    '@type': 'OrderAction',
                    deliveryMethod: [
                        'http://purl.org/goodrelations/v1#DeliveryModePickUp',
                        'http://purl.org/goodrelations/v1#DeliveryModeDirectDownload'
                    ]
                }
            }

        case 'Product':
            return {
                ...baseJsonLd,
                '@type': 'Product',
                name: data?.name || 'Custom Burger',
                description: data?.description || 'Build your custom burger with fresh ingredients',
                image: data?.image || `${seoConfig.siteUrl}/images/burger-empy.png`,
                brand: {
                    '@type': 'Brand',
                    name: seoConfig.siteName
                },
                offers: {
                    '@type': 'Offer',
                    price: data?.price || '4.00',
                    priceCurrency: 'USD',
                    availability: 'https://schema.org/InStock',
                    url: seoConfig.siteUrl
                },
                aggregateRating: {
                    '@type': 'AggregateRating',
                    ratingValue: '4.8',
                    reviewCount: '250'
                }
            }

        default:
            return baseJsonLd
    }
}
