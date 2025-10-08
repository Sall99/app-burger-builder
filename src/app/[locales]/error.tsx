'use client'

import { useEffect } from 'react'
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
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
            <div className="max-w-md w-full text-center">
                <div className="mb-8">
                    <svg
                        className="mx-auto h-20 w-20 text-red-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                    </svg>
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-4">{t('heading')}</h1>

                <p className="text-gray-600 mb-8">{t('description')}</p>

                {process.env.NODE_ENV === 'development' && error.message && (
                    <details className="mb-8 text-left bg-gray-100 p-4 rounded-lg">
                        <summary className="cursor-pointer font-semibold text-gray-700 mb-2">
                            {t('errorDetails')}
                        </summary>
                        <pre className="text-xs text-red-600 overflow-auto whitespace-pre-wrap">
                            {error.message}
                            {error.stack && `\n\nStack Trace:\n${error.stack}`}
                        </pre>
                        {error.digest && (
                            <p className="mt-2 text-xs text-gray-500">Error ID: {error.digest}</p>
                        )}
                    </details>
                )}

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        onClick={() => reset()}
                        className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
                        {t('tryAgain')}
                    </button>
                    <a
                        href="/"
                        className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
                        {t('goHome')}
                    </a>
                </div>

                {error.digest && (
                    <p className="mt-6 text-sm text-gray-500">
                        {t('errorReference')}{' '}
                        <code className="bg-gray-200 px-2 py-1 rounded">{error.digest}</code>
                    </p>
                )}
            </div>
        </div>
    )
}
