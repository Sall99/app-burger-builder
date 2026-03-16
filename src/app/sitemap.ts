import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://app-burger-builder.vercel.app'
    const currentDate = new Date()

    const routes = [
        {
            url: baseUrl,
            lastModified: currentDate,
            changeFrequency: 'daily' as const,
            priority: 1.0
        },

        {
            url: `${baseUrl}/en`,
            lastModified: currentDate,
            changeFrequency: 'daily' as const,
            priority: 1.0
        },
        {
            url: `${baseUrl}/en/auth/signin`,
            lastModified: currentDate,
            changeFrequency: 'monthly' as const,
            priority: 0.6
        },
        {
            url: `${baseUrl}/en/auth/signup`,
            lastModified: currentDate,
            changeFrequency: 'monthly' as const,
            priority: 0.6
        },
        {
            url: `${baseUrl}/en/locations`,
            lastModified: currentDate,
            changeFrequency: 'monthly' as const,
            priority: 0.8
        },
        {
            url: `${baseUrl}/en/help`,
            lastModified: currentDate,
            changeFrequency: 'monthly' as const,
            priority: 0.6
        },
        // French routes
        {
            url: `${baseUrl}/fr`,
            lastModified: currentDate,
            changeFrequency: 'daily' as const,
            priority: 1.0
        },
        {
            url: `${baseUrl}/fr/auth/signin`,
            lastModified: currentDate,
            changeFrequency: 'monthly' as const,
            priority: 0.6
        },
        {
            url: `${baseUrl}/fr/auth/signup`,
            lastModified: currentDate,
            changeFrequency: 'monthly' as const,
            priority: 0.6
        },
        {
            url: `${baseUrl}/fr/locations`,
            lastModified: currentDate,
            changeFrequency: 'monthly' as const,
            priority: 0.8
        },
        {
            url: `${baseUrl}/fr/help`,
            lastModified: currentDate,
            changeFrequency: 'monthly' as const,
            priority: 0.6
        }
    ]

    return routes
}
