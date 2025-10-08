'use client'

import { useEffect, useState } from 'react'
import { BiCheck, BiLoaderAlt, BiPackage, BiReceipt } from 'react-icons/bi'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'

export default function SuccessPage() {
    const searchParams = useSearchParams()
    const sessionId = searchParams.get('session_id')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [orderId, setOrderId] = useState<string | null>(null)
    const t = useTranslations('Success')

    useEffect(() => {
        const fetchOrderId = async () => {
            if (sessionId) {
                try {
                    const response = await fetch(`/api/stripe/session?session_id=${sessionId}`)
                    const data = await response.json()

                    if (data.orderId) {
                        setOrderId(data.orderId)
                    }
                    setLoading(false)
                } catch (err) {
                    console.error('Error fetching order ID:', err)
                    setLoading(false)
                }
            } else {
                setError('No session ID found')
                setLoading(false)
            }
        }

        fetchOrderId()
    }, [sessionId])

    if (loading) {
        return (
            <div className="max-w-6xl mx-auto my-8 min-h-screen px-8 sm:px-16 flex items-center justify-center">
                <div className="text-center">
                    <BiLoaderAlt className="w-12 h-12 animate-spin text-primary-200 mx-auto mb-4" />
                    <p className="text-lg text-gray-700">
                        {t('verifying') || 'Verifying your payment...'}
                    </p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="max-w-6xl mx-auto my-8 min-h-screen px-8 sm:px-16">
                <div className="bg-white rounded-lg shadow-md p-8 max-w-2xl mx-auto text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <BiCheck className="w-8 h-8 text-red-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">
                        {t('error') || 'Error'}
                    </h1>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <Link
                        href="/"
                        className="inline-block bg-primary-200 hover:bg-primary-600 text-white font-medium py-2 px-6 rounded text-sm transition-colors">
                        {t('returnHome') || 'Return to Home'}
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-6xl mx-auto my-8 min-h-screen px-8 sm:px-16">
            <div className="history-header">
                <BiCheck className="history-header-icon" />
                <div>
                    <h1 className="history-header-title">{t('title') || 'Payment Successful!'}</h1>
                    <p className="history-header-subtitle">
                        {t('subtitle') || 'Thank you for your order!'}
                    </p>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <BiPackage className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="flex-1">
                        <h2 className="text-lg font-semibold text-gray-900 mb-2">
                            {t('confirmation') ||
                                'Your burger order has been confirmed and is being prepared.'}
                        </h2>
                        <p className="text-sm text-gray-600">
                            {t('emailSent') ||
                                'A confirmation email has been sent to your email address.'}
                        </p>
                    </div>
                </div>

                {orderId && (
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                        <div className="flex items-center gap-2 mb-2">
                            <BiReceipt className="text-gray-600" />
                            <span className="text-sm font-medium text-gray-700">
                                {t('orderId') || 'Order ID'}
                            </span>
                        </div>
                        <div className="flex items-center justify-between ml-6">
                            <p className="text-xs text-gray-600 font-mono break-all">{orderId}</p>
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(orderId)
                                }}
                                className="ml-2 text-xs text-primary-200 hover:text-primary-600 font-medium">
                                Copy
                            </button>
                        </div>
                    </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    {orderId && (
                        <Link
                            href={`/track-order?order_id=${orderId}`}
                            className="bg-primary-200 hover:bg-primary-600 text-white font-medium py-2 px-5 rounded text-sm transition-colors text-center">
                            {t('trackOrder') || 'Track Your Order'}
                        </Link>
                    )}
                    <Link
                        href="/"
                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-5 rounded text-sm transition-colors text-center">
                        {t('buildAnother') || 'Build Another Burger'}
                    </Link>
                </div>
            </div>

            <div className="text-center">
                <p className="text-sm text-gray-500">
                    {t('needHelp') || 'Need help?'}{' '}
                    <Link
                        href="/help"
                        className="text-primary-200 hover:text-primary-600 font-medium">
                        {t('contactSupport') || 'Contact Support'}
                    </Link>
                </p>
            </div>
        </div>
    )
}
