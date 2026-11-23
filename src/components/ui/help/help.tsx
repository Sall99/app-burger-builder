'use client'

import React from 'react'
import { Disclosure } from '@headlessui/react'
import { ChevronDown, Github, Mail } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'

import { CREATOR_INFO } from '@/config/creator'

export default function Help() {
    const t = useTranslations('Help')
    const locale = useLocale()
    const isFr = locale === 'fr'

    const helpData = [
        { title: t('HowToBuild'), description: t('HowToBuildDescription') },
        { title: t('Customizing'), description: t('CustomizingDescription') },
        { title: t('Reviewing'), description: t('ReviewingDescription') },
        { title: t('PlacingOrder'), description: t('PlacingOrderDescription') },
        { title: t('SpecialOffers'), description: t('SpecialOffersDescription') }
    ]

    return (
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8 space-y-8">
            <div className="border-b border-surface-border pb-5">
                <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-ink">
                    {t('HelpTitle')}
                </h1>
            </div>

            <div className="divide-y divide-surface-border rounded-xl border border-surface-border bg-white overflow-hidden">
                {helpData.map(({ title, description }, index) => (
                    <Disclosure key={index} as="div" defaultOpen={index === 0}>
                        {({ open }) => (
                            <>
                                <Disclosure.Button className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left hover:bg-surface/50 transition-colors focus:outline-none">
                                    <span className="text-sm font-semibold text-ink">
                                        {title}
                                    </span>
                                    <ChevronDown
                                        size={16}
                                        className={`shrink-0 text-ink-subtle transition-transform duration-200 ${
                                            open ? 'rotate-180 text-ink' : ''
                                        }`}
                                    />
                                </Disclosure.Button>
                                <Disclosure.Panel className="px-5 pb-4 text-sm leading-relaxed text-ink-muted">
                                    {description}
                                </Disclosure.Panel>
                            </>
                        )}
                    </Disclosure>
                ))}
            </div>

            {/* Creator Contact Section */}
            <section className="rounded-xl border border-surface-border bg-white p-6">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-xs font-medium text-ink-subtle">
                            {isFr ? 'Créateur du projet' : 'Project Creator'}
                        </p>
                        <h2 className="mt-0.5 font-display text-lg font-bold text-ink">
                            {CREATOR_INFO.name}
                        </h2>
                        <p className="mt-1 text-sm text-ink-muted">
                            {isFr ? CREATOR_INFO.roleFr : CREATOR_INFO.roleEn}
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                        <a
                            href={`mailto:${CREATOR_INFO.email}`}
                            className="inline-flex items-center gap-2 rounded-lg bg-ink px-4 py-2 text-xs font-semibold text-white hover:bg-charcoal-light transition-colors">
                            <Mail size={13} />
                            <span>{CREATOR_INFO.email}</span>
                        </a>
                        <a
                            href={CREATOR_INFO.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 rounded-lg border border-surface-border bg-white px-3.5 py-2 text-xs font-semibold text-ink hover:bg-surface transition-colors">
                            <Github size={13} />
                            <span>GitHub</span>
                        </a>
                    </div>
                </div>
            </section>
        </div>
    )
}
