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

    // FAQ entries for structured rendering and schema
    const faqs = [0, 1, 2, 3, 4].map((i) => ({
        question: t(`faq.${i}.question`),
        answer: t(`faq.${i}.answer`)
    }))

    const faqSchema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer
            }
        }))
    }

    return (
        <>
            {/* Visually hidden primary SEO heading */}
            <h1 className="sr-only">{t('h1')}</h1>

            {/* FAQ structured data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />

            {/* Interactive burger builder UI */}
            <HomeClient />

            {/* Visible SEO content section — crawled by Google */}
            <section className="bg-neutral-950 text-white px-6 py-16 md:px-16 lg:px-24">
                <div className="max-w-5xl mx-auto space-y-16">

                    {/* How to Build */}
                    <div>
                        <h2 className="text-2xl font-bold text-amber-400 mb-4">{t('howToBuildTitle')}</h2>
                        <p className="text-gray-300 leading-relaxed text-base">{t('howToBuildText')}</p>
                    </div>

                    {/* Ingredients */}
                    <div>
                        <h2 className="text-2xl font-bold text-amber-400 mb-4">{t('ingredientsTitle')}</h2>
                        <p className="text-gray-300 leading-relaxed text-base">{t('ingredientsText')}</p>
                    </div>

                    {/* Delivery */}
                    <div>
                        <h2 className="text-2xl font-bold text-amber-400 mb-4">{t('deliveryTitle')}</h2>
                        <p className="text-gray-300 leading-relaxed text-base">{t('deliveryText')}</p>
                    </div>

                    {/* Why Choose */}
                    <div>
                        <h2 className="text-2xl font-bold text-amber-400 mb-6">{t('whyChooseTitle')}</h2>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <li key={i} className="flex items-start gap-2 text-gray-300">
                                    <span className="text-amber-400 mt-1 shrink-0">✓</span>
                                    <span>{t(`whyChoose${i}`)}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* FAQ */}
                    <div>
                        <h2 className="text-2xl font-bold text-amber-400 mb-6">{t('faqTitle')}</h2>
                        <div className="space-y-6">
                            {faqs.map((faq, i) => (
                                <div key={i} className="border-b border-neutral-800 pb-6">
                                    <h3 className="text-white font-semibold mb-2">{faq.question}</h3>
                                    <p className="text-gray-400 leading-relaxed">{faq.answer}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </section>
        </>
    )
}
