'use client'

import { useEffect, useState } from 'react'
import { AlertCircle, Check, CheckCircle2, Copy, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'

export default function SuccessPage() {
    const searchParams = useSearchParams()
    const locale = useLocale()
    const sessionId = searchParams.get('session_id')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [orderId, setOrderId] = useState<string | null>(null)
    const [copied, setCopied] = useState(false)
    const t = useTranslations('Success')

    useEffect(() => {
        const fetchOrderId = async () => {
            if (sessionId) {
                try {
                    const response = await fetch(`/api/stripe/session?session_id=${sessionId}`)
                    const data = await response.json()
                    if (data.orderId) setOrderId(data.orderId)
                } catch (err) {
                    console.error('Error fetching order ID:', err)
                } finally {
                    setLoading(false)
                }
            } else {
                setError('No session ID found')
                setLoading(false)
            }
        }
        fetchOrderId()
    }, [sessionId])

    const handleCopy = () => {
        if (!orderId) return
        navigator.clipboard.writeText(orderId)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    if (loading) {
        return (
            <div className="flex min-h-[70vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
            </div>
        )
    }

    if (error) {
        return (
            <div className="mx-auto max-w-md px-4 py-16">
                <div className="rounded-2xl border border-zinc-200 bg-white p-8 text-center space-y-4">
                    <AlertCircle className="mx-auto h-10 w-10 text-red-500" />
                    <h1 className="text-xl font-bold text-zinc-950">{t('error') || 'Error'}</h1>
                    <p className="text-sm text-zinc-500">{error}</p>
                    <Link
                        href={`/${locale}`}
                        className="inline-flex rounded-xl bg-zinc-950 px-5 py-2.5 text-sm font-semibold text-white">
                        {t('returnHome') || 'Return Home'}
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="mx-auto max-w-lg px-4 py-14">
            <div className="rounded-2xl border border-zinc-200 bg-white p-8 text-center shadow-card space-y-6">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                    <CheckCircle2 size={26} />
                </div>

                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-zinc-950">
                        {t('title') || 'Payment Successful'}
                    </h1>
                    <p className="mt-1.5 text-sm text-zinc-500">
                        {t('confirmation') ||
                            'Your burger order has been confirmed and is being prepared.'}
                    </p>
                </div>

                {orderId && (
                    <div className="flex items-center justify-between gap-2 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-left">
                        <div className="min-w-0">
                            <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                                {t('orderId') || 'Order ID'}
                            </p>
                            <p className="truncate font-mono text-xs font-semibold text-zinc-950">
                                {orderId}
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={handleCopy}
                            className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-xs font-medium text-zinc-700 hover:border-zinc-950">
                            {copied ? <Check size={12} /> : <Copy size={12} />}
                            <span>{copied ? 'Copied' : 'Copy'}</span>
                        </button>
                    </div>
                )}

                <div className="flex flex-col sm:flex-row gap-2.5">
                    {orderId && (
                        <Link
                            href={`/${locale}/track-order?order_id=${orderId}`}
                            className="flex-1 rounded-xl bg-zinc-950 py-2.5 text-sm font-semibold text-white hover:bg-zinc-800">
                            {t('trackOrder') || 'Track Order'}
                        </Link>
                    )}
                    <Link
                        href={`/${locale}`}
                        className="flex-1 rounded-xl border border-zinc-200 py-2.5 text-sm font-semibold text-zinc-800 hover:bg-zinc-50">
                        {t('buildAnother') || 'Build Another'}
                    </Link>
                </div>
            </div>
        </div>
    )
}
