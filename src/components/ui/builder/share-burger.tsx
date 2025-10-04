'use client'

import { useState } from 'react'
import { useSelector } from 'react-redux'
import { Check, Copy, Facebook, MessageCircle, Share2, Twitter } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { RootState } from '@/redux/store'

export function ShareBurger() {
    const t = useTranslations('Builder')
    const [isOpen, setIsOpen] = useState(false)
    const [copied, setCopied] = useState(false)

    const { ingredients, totalPrice, ingredientOrder } = useSelector(
        (state: RootState) => state.rootReducer.ingredients
    )

    const hasIngredients = (ingredientOrder?.length ?? 0) > 0

    // Generate shareable text
    const generateShareText = () => {
        const ingredientList = Object.entries(ingredients)
            .filter(([, count]) => count > 0)
            .map(([name, count]) => `${count}x ${name}`)
            .join(', ')

        return `Check out my custom burger! 🍔\n${ingredientList}\nTotal: $${totalPrice.toFixed(2)}\n\nBuild your own at ${window.location.origin}`
    }

    // Generate share URL with burger data
    const generateShareUrl = () => {
        const burgerData = btoa(JSON.stringify({ ingredients, totalPrice }))
        return `${window.location.origin}?burger=${burgerData}`
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

    const handleShareFacebook = () => {
        const url = encodeURIComponent(generateShareUrl())
        const text = encodeURIComponent(generateShareText())
        window.open(
            `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`,
            '_blank',
            'width=600,height=400'
        )
    }

    const handleShareTwitter = () => {
        const text = encodeURIComponent(generateShareText())
        window.open(
            `https://twitter.com/intent/tweet?text=${text}`,
            '_blank',
            'width=600,height=400'
        )
    }

    const handleShareWhatsApp = () => {
        const text = encodeURIComponent(generateShareText())
        window.open(`https://wa.me/?text=${text}`, '_blank')
    }

    const handleNativeShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'My Custom Burger',
                    text: generateShareText(),
                    url: generateShareUrl()
                })
            } catch (err) {
                console.error('Error sharing:', err)
            }
        }
    }

    if (!hasIngredients) return null

    return (
        <div className="mt-4">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="share-button w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors flex items-center justify-center gap-2">
                <Share2 size={18} />
                <span>{t('shareBurger') || 'Share My Burger'}</span>
            </button>

            {isOpen && (
                <div className="mt-2 bg-white border-2 border-gray-200 rounded-lg p-4 shadow-lg">
                    <h3 className="font-semibold text-gray-700 mb-3">
                        {t('shareOn') || 'Share on'}
                    </h3>

                    <div className="grid grid-cols-2 gap-2">
                        {/* Copy Link */}
                        <button
                            onClick={handleCopyLink}
                            className="flex items-center justify-center gap-2 p-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                            {copied ? (
                                <>
                                    <Check size={18} className="text-green-500" />
                                    <span className="text-sm">{t('copied') || 'Copied!'}</span>
                                </>
                            ) : (
                                <>
                                    <Copy size={18} />
                                    <span className="text-sm">{t('copyLink') || 'Copy Link'}</span>
                                </>
                            )}
                        </button>

                        {/* Facebook */}
                        <button
                            onClick={handleShareFacebook}
                            className="flex items-center justify-center gap-2 p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                            <Facebook size={18} />
                            <span className="text-sm">Facebook</span>
                        </button>

                        {/* Twitter */}
                        <button
                            onClick={handleShareTwitter}
                            className="flex items-center justify-center gap-2 p-3 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-colors">
                            <Twitter size={18} />
                            <span className="text-sm">Twitter</span>
                        </button>

                        {/* WhatsApp */}
                        <button
                            onClick={handleShareWhatsApp}
                            className="flex items-center justify-center gap-2 p-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors">
                            <MessageCircle size={18} />
                            <span className="text-sm">WhatsApp</span>
                        </button>
                    </div>

                    {/* Native Share (Mobile) */}
                    {navigator.share && (
                        <button
                            onClick={handleNativeShare}
                            className="w-full mt-2 flex items-center justify-center gap-2 p-3 bg-primary-200 hover:bg-primary-600 text-white rounded-lg transition-colors">
                            <Share2 size={18} />
                            <span className="text-sm">{t('shareMore') || 'More Options'}</span>
                        </button>
                    )}

                    {/* Preview Text */}
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg text-xs text-gray-600">
                        <p className="font-medium mb-1">{t('preview') || 'Preview'}:</p>
                        <p className="whitespace-pre-line">{generateShareText()}</p>
                    </div>
                </div>
            )}
        </div>
    )
}
