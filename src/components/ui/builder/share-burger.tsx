'use client'

import { useState } from 'react'
import { useSelector } from 'react-redux'
import { Check, Copy, Share2 } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { RootState } from '@/redux/store'

export function ShareBurger() {
    const t = useTranslations('Builder')
    const [copied, setCopied] = useState(false)

    const { ingredients, totalPrice, ingredientOrder } = useSelector(
        (state: RootState) => state.rootReducer.ingredients
    )

    if ((ingredientOrder?.length ?? 0) === 0) return null

    const generateShareUrl = () => {
        const origin = typeof window !== 'undefined' ? window.location.origin : ''
        const burgerData = btoa(JSON.stringify({ ingredients, totalPrice }))
        return `${origin}?burger=${burgerData}`
    }

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(generateShareUrl())
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            console.error('Failed to copy:', err)
        }
    }

    return (
        <div className="flex items-center justify-between gap-3 rounded-2xl border border-zinc-200/80 bg-white px-5 py-3.5">
            <div className="flex items-center gap-2.5 min-w-0">
                <Share2 size={15} className="shrink-0 text-zinc-500" />
                <p className="truncate text-xs font-semibold text-zinc-900">
                    {t('shareBurger') || 'Share My Burger'}
                </p>
            </div>
            <button
                type="button"
                onClick={handleCopyLink}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-semibold text-zinc-800 hover:border-zinc-950 hover:bg-white transition-colors">
                {copied ? (
                    <>
                        <Check size={13} className="text-emerald-600" />
                        <span className="text-emerald-700">{t('copied') || 'Copied'}</span>
                    </>
                ) : (
                    <>
                        <Copy size={13} />
                        <span>{t('copyLink') || 'Copy Link'}</span>
                    </>
                )}
            </button>
        </div>
    )
}
