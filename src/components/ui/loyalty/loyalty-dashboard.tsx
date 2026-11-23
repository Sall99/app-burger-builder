'use client'

import React from 'react'
import { useSelector } from 'react-redux'
import { Check } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { selectLoyalty } from '@/redux/selectors/loyalty'
import {
    getNextTier,
    getProgressToNextTier,
    LOYALTY_TIERS,
    type LoyaltyTier
} from '@/types/loyalty'

export const LoyaltyDashboard: React.FC = () => {
    const t = useTranslations('Loyalty')
    const loyalty = useSelector(selectLoyalty)

    const { totalPoints, availablePoints, currentTier, lifetimeSpend, ordersCount } = loyalty
    const tierInfo = LOYALTY_TIERS[currentTier]
    const nextTier = getNextTier(currentTier)
    const progress = getProgressToNextTier(totalPoints, currentTier)

    return (
        <div className="space-y-6">
            {/* Clean Tier Overview Card */}
            <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-100 text-2xl">
                            {tierInfo.icon}
                        </div>
                        <div>
                            <p className="text-xs font-medium text-zinc-500">
                                {t('earnMultiplier', { multiplier: tierInfo.pointsMultiplier })}
                            </p>
                            <h2 className="text-xl font-bold tracking-tight text-zinc-950">
                                {tierInfo.name}
                            </h2>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="text-right">
                            <p className="text-[11px] font-medium text-zinc-500">
                                {t('available')}
                            </p>
                            <p className="text-2xl font-bold text-orange-600 tabular-nums">
                                {availablePoints}
                            </p>
                        </div>
                        <div className="h-8 w-px bg-zinc-200" />
                        <div className="text-right">
                            <p className="text-[11px] font-medium text-zinc-500">
                                {t('totalPoints')}
                            </p>
                            <p className="text-2xl font-bold text-zinc-950 tabular-nums">
                                {totalPoints}
                            </p>
                        </div>
                    </div>
                </div>

                {nextTier ? (
                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                            <span className="font-medium text-zinc-600">
                                {t('progressTo', { tier: nextTier.name })}
                            </span>
                            <span className="font-semibold text-zinc-950 tabular-nums">
                                {progress.current} / {progress.needed} {t('points')}
                            </span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-100">
                            <div
                                className="h-full rounded-full bg-zinc-950 transition-all duration-500"
                                style={{ width: `${Math.min(100, progress.percentage)}%` }}
                            />
                        </div>
                    </div>
                ) : (
                    <p className="text-xs font-semibold text-emerald-700">
                        {t('maxTierAchieved')}
                    </p>
                )}

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 border-t border-zinc-100 pt-5">
                    <div>
                        <p className="text-[11px] text-zinc-500">{t('lifetimeSpend')}</p>
                        <p className="text-base font-bold text-zinc-950 tabular-nums">
                            ${lifetimeSpend.toFixed(2)}
                        </p>
                    </div>
                    <div>
                        <p className="text-[11px] text-zinc-500">{t('orders')}</p>
                        <p className="text-base font-bold text-zinc-950 tabular-nums">
                            {ordersCount}
                        </p>
                    </div>
                    <div className="col-span-2">
                        <p className="text-[11px] text-zinc-500 mb-1.5">{t('yourBenefits')}</p>
                        <div className="flex flex-wrap gap-1.5">
                            {tierInfo.benefits.map((b, i) => (
                                <span
                                    key={i}
                                    className="inline-flex items-center gap-1 rounded-md bg-zinc-100 px-2 py-0.5 text-[11px] font-medium text-zinc-700">
                                    <Check size={10} className="text-emerald-600" />
                                    {b}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Tiers Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {(Object.keys(LOYALTY_TIERS) as LoyaltyTier[]).map((tier) => {
                    const info = LOYALTY_TIERS[tier]
                    const isCurrent = tier === currentTier
                    return (
                        <div
                            key={tier}
                            className={`rounded-2xl border p-4 text-center ${
                                isCurrent
                                    ? 'border-zinc-950 bg-zinc-950 text-white'
                                    : 'border-zinc-200/80 bg-white text-zinc-900'
                            }`}>
                            <span className="text-xl block mb-1">{info.icon}</span>
                            <p className="text-xs font-semibold">{info.name}</p>
                            <p
                                className={`text-[11px] ${isCurrent ? 'text-zinc-400' : 'text-zinc-500'}`}>
                                {info.minPoints}+ {t('pts')}
                            </p>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
