'use client'

import React from 'react'
import { BiSupport } from 'react-icons/bi'
import { useTranslations } from 'next-intl'

import { tawkHelpers } from './tawk-chat'

export const ChatTriggerButton: React.FC = () => {
    const t = useTranslations('Chat')

    const handleClick = () => {
        tawkHelpers.open()
    }

    return (
        <button
            onClick={handleClick}
            className="chat-trigger-button"
            aria-label={t('openChat')}
            title={t('needHelp')}>
            <BiSupport className="chat-trigger-icon" aria-hidden="true" />
            <span className="chat-trigger-text">{t('needHelp')}</span>
        </button>
    )
}

export const FloatingChatButton: React.FC = () => {
    const t = useTranslations('Chat')

    const handleClick = () => {
        tawkHelpers.open()
    }

    return (
        <button
            onClick={handleClick}
            className="floating-chat-button"
            aria-label={t('openChat')}
            title={t('needHelp')}>
            <BiSupport className="floating-chat-icon" aria-hidden="true" />
        </button>
    )
}
