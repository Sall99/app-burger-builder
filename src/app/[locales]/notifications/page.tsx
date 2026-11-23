'use client'

import React from 'react'
import { useTranslations } from 'next-intl'

import { AccountShell } from '@/components/account'
import { NotificationSettings } from '@/components/ui/notifications'

export default function NotificationsPage() {
    const t = useTranslations('Notifications')

    return (
        <AccountShell title={t('title')} subtitle={t('subtitle')}>
            <NotificationSettings />
        </AccountShell>
    )
}
