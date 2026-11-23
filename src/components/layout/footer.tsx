'use client'

import React from 'react'
import { Flame, Github, Mail } from 'lucide-react'
import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'

import { CREATOR_INFO } from '@/config/creator'

export const Footer = () => {
    const t = useTranslations('Header')
    const tp = useTranslations('Popover')
    const locale = useLocale()
    const isFr = locale === 'fr'
    const year = new Date().getFullYear()

    return (
        <footer className="mt-16 border-t border-surface-border bg-white text-ink">
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
                    {/* Brand */}
                    <div className="md:col-span-5 space-y-3">
                        <Link
                            href={`/${locale}`}
                            className="inline-flex items-center gap-2.5 focus:outline-none">
                            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500 text-white">
                                <Flame size={17} strokeWidth={2.25} aria-hidden="true" />
                            </span>
                            <span className="font-display text-lg font-bold tracking-tight text-ink">
                                BurgerBuilder
                            </span>
                        </Link>
                        <p className="max-w-sm text-sm leading-relaxed text-ink-muted">
                            {isFr
                                ? 'Burgers préparés à la commande avec bœuf frais, cheddar affiné et pain brioché artisanal. Composez votre recette ou choisissez un classique.'
                                : 'Burgers made to order with fresh beef, aged cheddar, and artisan brioche buns. Build your own recipe or pick a house classic.'}
                        </p>
                    </div>

                    {/* Links */}
                    <div className="md:col-span-2 space-y-2.5">
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-subtle">
                            {isFr ? 'Menu' : 'Menu'}
                        </h3>
                        <ul className="space-y-2 text-sm text-ink-muted">
                            <li>
                                <Link href={`/${locale}`} className="hover:text-ink transition-colors">
                                    {isFr ? 'Configurateur' : 'Burger Studio'}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href={`/${locale}/loyalty`}
                                    className="hover:text-ink transition-colors">
                                    {t('loyalty')}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href={`/${locale}/locations`}
                                    className="hover:text-ink transition-colors">
                                    {t('locations')}
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div className="md:col-span-2 space-y-2.5">
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-subtle">
                            {isFr ? 'Compte' : 'Account'}
                        </h3>
                        <ul className="space-y-2 text-sm text-ink-muted">
                            <li>
                                <Link
                                    href={`/${locale}/track-order`}
                                    className="hover:text-ink transition-colors">
                                    {tp('trackOrder')}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href={`/${locale}/history`}
                                    className="hover:text-ink transition-colors">
                                    {tp('history')}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href={`/${locale}/profile`}
                                    className="hover:text-ink transition-colors">
                                    {tp('profile')}
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div className="md:col-span-3 space-y-2.5">
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-subtle">
                            {isFr ? 'Informations' : 'Information'}
                        </h3>
                        <ul className="space-y-2 text-sm text-ink-muted">
                            <li>
                                <Link
                                    href={`/${locale}/help`}
                                    className="hover:text-ink transition-colors">
                                    {tp('help')}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href={`/${locale}/notifications`}
                                    className="hover:text-ink transition-colors">
                                    {t('notifications')}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href={`/${locale}/auth/sign-in`}
                                    className="hover:text-ink transition-colors">
                                    {t('signIn')}
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-surface-border pt-6 text-xs text-ink-muted sm:flex-row md:pr-28">
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-3 gap-y-1.5">
                        <p>
                            © {year} BurgerBuilder · {isFr ? 'Créé par' : 'Created by'}{' '}
                            <span className="font-semibold text-ink">{CREATOR_INFO.name}</span>
                        </p>
                        <span className="hidden sm:inline text-surface-border">·</span>
                        <a
                            href={`mailto:${CREATOR_INFO.email}`}
                            className="inline-flex items-center gap-1 text-ink-muted hover:text-ink transition-colors">
                            <Mail size={12} />
                            <span>{CREATOR_INFO.email}</span>
                        </a>
                        <a
                            href={CREATOR_INFO.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-ink-muted hover:text-ink transition-colors">
                            <Github size={12} />
                            <span>GitHub</span>
                        </a>
                    </div>
                    <p className="text-ink-subtle">
                        {isFr ? 'Tous droits réservés.' : 'All rights reserved.'}
                    </p>
                </div>
            </div>
        </footer>
    )
}
