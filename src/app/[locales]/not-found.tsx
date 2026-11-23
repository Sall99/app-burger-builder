'use client'

import { ArrowLeft, Compass, Home } from 'lucide-react'
import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'

export default function NotFound() {
    const t = useTranslations('Pages.NotFound')
    const locale = useLocale()

    return (
        <div className="flex min-h-[75vh] items-center justify-center px-4 py-12">
            <div className="w-full max-w-md rounded-2xl border border-zinc-200/80 bg-white p-8 sm:p-10 text-center">
                <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-100 text-zinc-900">
                    <Compass size={22} aria-hidden="true" />
                </div>

                <h1 className="text-5xl font-semibold tracking-tight text-zinc-950">
                    {t('heading')}
                </h1>
                <h2 className="mt-2 text-lg font-semibold text-zinc-950">{t('subheading')}</h2>
                <p className="mt-2 text-sm text-zinc-500">{t('description')}</p>

                <div className="mt-7 flex flex-col sm:flex-row gap-2.5 justify-center">
                    <Link
                        href={`/${locale}`}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-950 px-5 py-2.5 text-sm font-medium text-white hover:bg-zinc-800 transition-colors">
                        <Home size={15} />
                        <span>{t('goHome')}</span>
                    </Link>
                    <button
                        type="button"
                        onClick={() => window.history.back()}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-5 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition-colors">
                        <ArrowLeft size={15} />
                        <span>{t('goBack')}</span>
                    </button>
                </div>

                <div className="mt-7 border-t border-zinc-100 pt-5">
                    <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                        {t('lookingFor')}
                    </p>
                    <div className="flex flex-wrap justify-center gap-2 text-xs">
                        <Link
                            href={`/${locale}`}
                            className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 font-medium text-zinc-700 hover:border-zinc-300 hover:bg-white transition-colors">
                            {t('buildBurger')}
                        </Link>
                        <Link
                            href={`/${locale}/history`}
                            className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 font-medium text-zinc-700 hover:border-zinc-300 hover:bg-white transition-colors">
                            {t('orderHistory')}
                        </Link>
                        <Link
                            href={`/${locale}/profile`}
                            className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 font-medium text-zinc-700 hover:border-zinc-300 hover:bg-white transition-colors">
                            {t('yourProfile')}
                        </Link>
                        <Link
                            href={`/${locale}/help`}
                            className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 font-medium text-zinc-700 hover:border-zinc-300 hover:bg-white transition-colors">
                            {t('helpSupport')}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
