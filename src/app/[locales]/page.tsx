import React from 'react'
import { Flame, Truck, UtensilsCrossed } from 'lucide-react'
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

    const pillars = [
        {
            icon: Flame,
            title: t('howToBuildTitle'),
            desc: t('howToBuildText')
        },
        {
            icon: UtensilsCrossed,
            title: t('ingredientsTitle'),
            desc: t('ingredientsText')
        },
        {
            icon: Truck,
            title: t('deliveryTitle'),
            desc: t('deliveryText')
        }
    ]

    return (
        <div>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />

            <HomeClient />

            {/* Clean 3-Column Editorial Section */}
            <section className="border-t border-surface-border bg-white py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                        {pillars.map(({ icon: Icon, title, desc }) => (
                            <div key={title} className="space-y-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-surface-border bg-surface text-ink">
                                    <Icon size={17} aria-hidden="true" />
                                </div>
                                <h2 className="font-display text-lg font-bold tracking-tight text-ink">
                                    {title}
                                </h2>
                                <p className="text-sm leading-relaxed text-ink-muted">{desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Clean FAQ Section */}
            <section
                aria-labelledby="faq-heading"
                className="border-t border-surface-border bg-surface py-12">
                <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                    <h2
                        id="faq-heading"
                        className="mb-6 font-display text-2xl font-bold tracking-tight text-ink">
                        {t('faqTitle')}
                    </h2>

                    <div className="divide-y divide-surface-border rounded-xl border border-surface-border bg-white">
                        {faqs.map((faq, idx) => (
                            <details key={idx} className="group px-5 py-4">
                                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-ink">
                                    <span>{faq.question}</span>
                                    <span className="text-base text-ink-subtle transition-transform group-open:rotate-45">
                                        +
                                    </span>
                                </summary>
                                <p className="mt-2.5 text-sm leading-relaxed text-ink-muted">
                                    {faq.answer}
                                </p>
                            </details>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
}
