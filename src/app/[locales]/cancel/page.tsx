'use client'

import { AlertTriangle, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'

export default function CancelPage() {
    const t = useTranslations('Cancel')
    const locale = useLocale()

    return (
        <div className="mx-auto max-w-lg px-4 py-14">
            <div className="rounded-2xl border border-zinc-200 bg-white p-8 text-center shadow-card space-y-6">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 text-amber-600">
                    <AlertTriangle size={24} />
                </div>

                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-zinc-950">
                        {t('title') || 'Payment Cancelled'}
                    </h1>
                    <p className="mt-1.5 text-sm text-zinc-500">
                        {t('message') ||
                            'No charges were made to your account. Your burger order was not completed.'}
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-2.5">
                    <Link
                        href={`/${locale}`}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-zinc-950 py-2.5 text-sm font-semibold text-white hover:bg-zinc-800">
                        <ArrowLeft size={15} />
                        <span>{t('tryAgain') || 'Try Again'}</span>
                    </Link>
                    <Link
                        href={`/${locale}/help`}
                        className="flex-1 rounded-xl border border-zinc-200 py-2.5 text-sm font-semibold text-zinc-800 hover:bg-zinc-50">
                        {t('getHelp') || 'Get Help'}
                    </Link>
                </div>
            </div>
        </div>
    )
}
