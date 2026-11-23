'use client'

import React from 'react'
import { useTranslations } from 'next-intl'

import { AccountShell } from '@/components/account'
import { LoyaltyDashboard, RewardsCatalog } from '@/components/ui/loyalty'
import { LoyaltyInitializer } from '@/components/ui/loyalty/loyalty-initializer'

export default function LoyaltyPage() {
    const t = useTranslations('Loyalty')

    return (
        <LoyaltyInitializer>
            <AccountShell title={t('title')} subtitle={t('subtitle')}>
                <div className="space-y-6">
                    <LoyaltyDashboard />
                    <RewardsCatalog />
                </div>
            </AccountShell>
        </LoyaltyInitializer>
    )
}
