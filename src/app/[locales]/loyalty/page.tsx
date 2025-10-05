'use client'

import React from 'react'

import { LoyaltyDashboard, RewardsCatalog } from '@/components/ui/loyalty'
import { LoyaltyInitializer } from '@/components/ui/loyalty/loyalty-initializer'

export default function LoyaltyPage() {
    return (
        <LoyaltyInitializer>
            <section className="min-h-screen py-8">
                {/* Loyalty Dashboard */}
                <LoyaltyDashboard />

                {/* Rewards Catalog */}
                <RewardsCatalog />
            </section>
        </LoyaltyInitializer>
    )
}
