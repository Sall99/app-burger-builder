'use client'

import React from 'react'
import { Sparkles } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { chatHelpers } from './gemini-chat'

export const ChatTriggerButton: React.FC = () => {
    const t = useTranslations('Chat')

    const handleClick = () => {
        chatHelpers.open()
    }

    return (
        <button
            type="button"
            onClick={handleClick}
            className="inline-flex items-center gap-2 rounded-full bg-brand-500 px-4 py-2 text-xs font-bold text-white shadow-brand hover:bg-brand-600 transition-all"
            aria-label={t('openChat')}
            title={t('needHelp')}>
            <Sparkles size={15} aria-hidden="true" />
            <span>{t('needHelp')}</span>
        </button>
    )
}

export const FloatingChatButton: React.FC = () => {
    const t = useTranslations('Chat')

    const handleClick = () => {
        chatHelpers.open()
    }

    return (
        <button
            type="button"
            onClick={handleClick}
            className="fixed bottom-20 right-4 lg:bottom-6 lg:right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-brand-500 text-white shadow-brand hover:bg-brand-600 active:scale-95 transition-all"
            aria-label={t('openChat')}
            title={t('needHelp')}>
            <Sparkles size={20} aria-hidden="true" />
        </button>
    )
}
