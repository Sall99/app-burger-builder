'use client'

import { useState } from 'react'
import { BiShare } from 'react-icons/bi'
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

    const generateShareText = () => {
        const ingredientList = Object.entries(ingredients)
            .filter(([, count]) => count > 0)
            .map(([name, count]) => `${count}x ${name}`)
            .join(', ')

        return `Check out my custom burger! 🍔\n${ingredientList}\nTotal: $${totalPrice.toFixed(2)}\n\nBuild your own at ${window.location.origin}`
    }

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
        <div className="share-burger-container">
            <div className="share-burger-header" onClick={() => setIsOpen(!isOpen)}>
                <BiShare className="share-burger-icon" aria-hidden="true" />
                <div className="share-burger-title-wrapper">
                    <h3 className="share-burger-title">{t('shareBurger') || 'Share My Burger'}</h3>
                    <p className="share-burger-subtitle">
                        {t('shareSubtitle') || 'Share your creation with friends'}
                    </p>
                </div>
                <span className="share-burger-arrow">{isOpen ? '▼' : '▶'}</span>
            </div>

            {isOpen && (
                <div className="share-burger-content">
                    <h4 className="share-options-title">{t('shareOn') || 'Share on'}</h4>

                    <div className="share-options-grid">
                        <button onClick={handleCopyLink} className="share-option-button">
                            {copied ? (
                                <>
                                    <Check size={20} className="share-option-icon-success" />
                                    <span className="share-option-label">
                                        {t('copied') || 'Copied!'}
                                    </span>
                                </>
                            ) : (
                                <>
                                    <Copy size={20} className="share-option-icon" />
                                    <span className="share-option-label">
                                        {t('copyLink') || 'Copy Link'}
                                    </span>
                                </>
                            )}
                        </button>

                        <button
                            onClick={handleShareFacebook}
                            className="share-option-button share-option-facebook">
                            <Facebook size={20} />
                            <span className="share-option-label">Facebook</span>
                        </button>

                        <button
                            onClick={handleShareTwitter}
                            className="share-option-button share-option-twitter">
                            <Twitter size={20} />
                            <span className="share-option-label">Twitter</span>
                        </button>

                        <button
                            onClick={handleShareWhatsApp}
                            className="share-option-button share-option-whatsapp">
                            <MessageCircle size={20} />
                            <span className="share-option-label">WhatsApp</span>
                        </button>
                    </div>

                    {typeof navigator.share === 'function' && (
                        <button onClick={handleNativeShare} className="share-native-button">
                            <Share2 size={18} />
                            <span>{t('shareMore') || 'More Options'}</span>
                        </button>
                    )}

                    <div className="share-preview">
                        <p className="share-preview-title">{t('preview') || 'Preview'}:</p>
                        <p className="share-preview-text">{generateShareText()}</p>
                    </div>
                </div>
            )}
        </div>
    )
}
