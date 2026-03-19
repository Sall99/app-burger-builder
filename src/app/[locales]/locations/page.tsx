import React from 'react'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

import { LocationFinder } from '@/components/ui/locations'

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations('Pages')

    return {
        title: 'Find Burger Locations Near You | Burger Builder',
        description:
            'Find Burger Builder restaurant locations near you. Check store hours, get directions, and order your custom burger for pickup or delivery.',
        keywords:
            'burger restaurant near me, burger locations, find burger restaurant, custom burger near me, burger delivery near me, burger shop, food restaurant near me',
        alternates: {
            canonical: 'https://app-burger-builder.vercel.app/en/locations'
        },
        openGraph: {
            title: 'Find Burger Locations Near You | Burger Builder',
            description:
                'Discover Burger Builder locations in your area. View store hours, get directions, and place your order online.',
            url: 'https://app-burger-builder.vercel.app/en/locations'
        }
    }
}

export default function LocationsPage() {
    return (
        <section className="min-h-screen py-8">
            <LocationFinder />
        </section>
    )
}
