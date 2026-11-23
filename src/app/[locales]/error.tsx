'use client'

import { useEffect } from 'react'
import { AlertTriangle, Home, RotateCcw } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { logError } from '@/lib/error-logger'

export default function Error({
    error,
    reset
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    const t = useTranslations('Pages.Error')

    useEffect(() => {
        logError(error, {
            digest: error.digest,
            type: 'PAGE_ERROR'
        })
    }, [error])

    return (
        <div className="flex min-h-[75vh] items-center justify-center px-4 py-12">
            <div className="w-full max-w-md rounded-2xl border border-zinc-200/80 bg-white p-8 sm:p-10 text-center">
                <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600 ring-1 ring-red-200/80">
                    <AlertTriangle size={22} aria-hidden="true" />
                </div>

                <h1 className="text-2xl font-semibold tracking-tight text-zinc-950">
                    {t('heading')}
                </h1>
                <p className="mt-2 text-sm text-zinc-500">{t('description')}</p>

                {process.env.NODE_ENV === 'development' && error.message && (
                    <details className="mt-5 rounded-xl border border-zinc-200 bg-zinc-50 p-3.5 text-left">
                        <summary className="cursor-pointer text-xs font-semibold text-zinc-900">
                            {t('errorDetails')}
                        </summary>
                        <pre className="mt-2 overflow-auto whitespace-pre-wrap text-xs text-red-600">
                            {error.message}
                            {error.stack && `\n\nStack Trace:\n${error.stack}`}
                        </pre>
                    </details>
                )}

                <div className="mt-7 flex flex-col sm:flex-row gap-2.5 justify-center">
                    <button
                        type="button"
                        onClick={() => reset()}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-950 px-5 py-2.5 text-sm font-medium text-white hover:bg-zinc-800 transition-colors">
                        <RotateCcw size={15} />
                        <span>{t('tryAgain')}</span>
                    </button>
                    <a
                        href="/"
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-5 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition-colors">
                        <Home size={15} />
                        <span>{t('goHome')}</span>
                    </a>
                </div>

                {error.digest && (
                    <p className="mt-6 text-xs text-zinc-400">
                        {t('errorReference')}{' '}
                        <code className="rounded-md bg-zinc-100 px-2 py-0.5 font-mono text-zinc-700">
                            {error.digest}
                        </code>
                    </p>
                )}
            </div>
        </div>
    )
}
