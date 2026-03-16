import React from 'react'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

import { seoConfig } from '@/config/seo'

import { HomeClient } from './home-client'

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations('Pages.Home')

    return {
        title: t('title'),
        description: t('description'),
        keywords: seoConfig.keywords.join(', ')
    }
}

export default async function Home() {
    const t = await getTranslations('Pages.Home')

    return (
        <>
            <section className="sr-only" aria-label="Page description">
                <h1>{t('h1')}</h1>
                <p>{t('seoText')}</p>
            </section>
            <HomeClient />
        </>
    )
}
