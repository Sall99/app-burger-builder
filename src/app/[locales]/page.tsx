'use client'

import React from 'react'
import { useSelector } from 'react-redux'
import Head from 'next/head' // Import Head from next/head for client-side SEO management

import { Builder, Controls, Total } from '@/components/ui'
import { selectIngredients } from '@/redux/selectors/ingredients'

export default function Home() {
    const { ingredients } = useSelector(selectIngredients)
    const schemaOrgData = {
        '@context': 'http://schema.org',
        '@type': 'Restaurant',
        url: 'https://app-burger-builder.vercel.app',
        name: 'Burger Builder',
        description: 'Build your perfect burger with our easy-to-use Burger Builder.',
        publisher: {
            '@type': 'Organization',
            name: 'Sall99'
        }
    }

    return (
        <>
            <Head>
                <title>Burger Builder - Customize Your Perfect Burger</title>
                <meta
                    name="description"
                    content="Build your own burger with a variety of fresh ingredients using our interactive Burger Builder tool. Customize and create your perfect meal!"
                />
                <meta
                    name="keywords"
                    content="Burger Builder, Custom Burgers, Best Burger, Food, Restaurant"
                />
                <meta
                    property="og:title"
                    content="Burger Builder - Customize Your Perfect Burger"
                />
                <meta
                    property="og:description"
                    content="Build your own burger with a variety of fresh ingredients using our interactive Burger Builder tool."
                />
                <meta property="og:image" content="https://yourwebsite.com/og-image.jpg" />
                <meta property="og:url" content="https://yourwebsite.com" />
                <meta property="og:type" content="website" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta
                    name="twitter:title"
                    content="Burger Builder - Customize Your Perfect Burger"
                />
                <meta
                    name="twitter:description"
                    content="Build your own burger with a variety of fresh ingredients using our interactive Burger Builder tool."
                />
                <meta name="twitter:image" content="https://yourwebsite.com/twitter-image.jpg" />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrgData) }}
                />
            </Head>
            <section className="flex min-h-screen flex-col items-center pt-8">
                <section className="flex flex-col items-center px-8 sm:px-16 justify-center relative w-full">
                    <Total />
                    <Builder ingredients={ingredients} />
                </section>
                <section className="px-8 sm:px-16 w-full">
                    <Controls />
                </section>
            </section>
        </>
    )
}
