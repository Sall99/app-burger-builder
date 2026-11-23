'use client'

import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Lock } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { selectLoyalty } from '@/redux/selectors/loyalty'
import { redeemReward } from '@/redux/slices/loyalty'
import { getAvailableRewards, type Reward, REWARDS } from '@/types/loyalty'

export const RewardsCatalog: React.FC = () => {
    const t = useTranslations('Rewards')
    const dispatch = useDispatch()
    const loyalty = useSelector(selectLoyalty)
    const [filter, setFilter] = useState<'all' | 'available' | 'popular'>('all')
    const [redeeming, setRedeeming] = useState<string | null>(null)

    const { availablePoints, currentTier } = loyalty
    const availableRewards = getAvailableRewards(availablePoints, currentTier)

    let displayedRewards = REWARDS
    if (filter === 'available') displayedRewards = availableRewards
    else if (filter === 'popular') displayedRewards = REWARDS.filter((r) => r.isPopular)

    const handleRedeem = async (reward: Reward) => {
        setRedeeming(reward.id)
        try {
            const { redeemLoyaltyReward } = await import('@/actions/loyalty')
            const result = await redeemLoyaltyReward({
                rewardId: reward.id,
                rewardName: reward.name,
                pointsCost: reward.pointsCost,
                expiryDays: reward.expiryDays
            })

            if (result.success) {
                dispatch(
                    redeemReward({
                        rewardId: reward.id,
                        pointsCost: reward.pointsCost,
                        expiryDays: reward.expiryDays
                    })
                )
            } else if (typeof window !== 'undefined') {
                const { default: toast } = await import('react-hot-toast')
                toast.error(result.error || 'Failed to redeem reward')
            }
        } catch {
            if (typeof window !== 'undefined') {
                const { default: toast } = await import('react-hot-toast')
                toast.error('An error occurred while redeeming the reward')
            }
        } finally {
            setRedeeming(null)
        }
    }

    const canRedeem = (reward: Reward) => availableRewards.some((r) => r.id === reward.id)

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-base font-semibold text-zinc-950">{t('title')}</h2>
                <div className="inline-flex rounded-xl bg-zinc-100 p-1">
                    {(
                        [
                            { id: 'all', label: t('allRewards') },
                            { id: 'available', label: `${t('availableNow')} (${availableRewards.length})` },
                            { id: 'popular', label: t('popular') }
                        ] as const
                    ).map((item) => (
                        <button
                            key={item.id}
                            type="button"
                            onClick={() => setFilter(item.id)}
                            className={`rounded-lg px-3 py-1 text-xs font-medium transition-all ${
                                filter === item.id
                                    ? 'bg-white text-zinc-950 font-semibold shadow-soft'
                                    : 'text-zinc-500 hover:text-zinc-900'
                            }`}>
                            {item.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {displayedRewards.map((reward) => {
                    const redeemable = canRedeem(reward)
                    const isRedeeming = redeeming === reward.id
                    return (
                        <div
                            key={reward.id}
                            className="flex flex-col justify-between rounded-2xl border border-zinc-200/80 bg-white p-5">
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-2xl">{reward.icon}</span>
                                    <span className="text-xs font-semibold text-orange-600 tabular-nums">
                                        {reward.pointsCost} {t('pts')}
                                    </span>
                                </div>
                                <h3 className="text-sm font-semibold text-zinc-950">
                                    {reward.name}
                                </h3>
                                <p className="mt-1 text-xs text-zinc-500">{reward.description}</p>
                            </div>

                            <button
                                type="button"
                                onClick={() => handleRedeem(reward)}
                                disabled={!redeemable || isRedeeming}
                                className={`mt-5 flex w-full items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-semibold transition-all ${
                                    redeemable
                                        ? 'bg-zinc-950 text-white hover:bg-zinc-800'
                                        : 'bg-zinc-100 text-zinc-400 cursor-not-allowed'
                                }`}>
                                {!redeemable && <Lock size={12} />}
                                <span>
                                    {isRedeeming
                                        ? t('redeeming')
                                        : redeemable
                                          ? t('redeem')
                                          : availablePoints < reward.pointsCost
                                            ? t('needPoints', {
                                                  points: reward.pointsCost - availablePoints
                                              })
                                            : t('locked')}
                                </span>
                            </button>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
