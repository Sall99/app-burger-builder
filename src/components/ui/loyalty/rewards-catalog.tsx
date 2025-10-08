'use client'

import React, { useState } from 'react'
import { BiDollar, BiStar } from 'react-icons/bi'
import { MdCardGiftcard } from 'react-icons/md'
import { useDispatch, useSelector } from 'react-redux'
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
    if (filter === 'available') {
        displayedRewards = availableRewards
    } else if (filter === 'popular') {
        displayedRewards = REWARDS.filter((r) => r.isPopular)
    }

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

                if (typeof window !== 'undefined') {
                    const announcement = `Successfully redeemed ${reward.name}!`
                    const ariaLive = document.createElement('div')
                    ariaLive.setAttribute('role', 'status')
                    ariaLive.setAttribute('aria-live', 'polite')
                    ariaLive.className = 'sr-only'
                    ariaLive.textContent = announcement
                    document.body.appendChild(ariaLive)
                    setTimeout(() => document.body.removeChild(ariaLive), 1000)
                }
            } else {
                if (typeof window !== 'undefined') {
                    const { default: toast } = await import('react-hot-toast')
                    toast.error(result.error || 'Failed to redeem reward')
                }
            }
        } catch (error) {
            console.error('Error redeeming reward:', error)
            if (typeof window !== 'undefined') {
                const { default: toast } = await import('react-hot-toast')
                toast.error('An error occurred while redeeming the reward')
            }
        } finally {
            setRedeeming(null)
        }
    }

    const canRedeem = (reward: Reward): boolean => {
        return availableRewards.some((r) => r.id === reward.id)
    }

    return (
        <div className="rewards-catalog">
            <div className="rewards-header">
                <MdCardGiftcard className="rewards-icon" aria-hidden="true" />
                <div>
                    <h3 className="rewards-title">{t('title')}</h3>
                    <p className="rewards-subtitle">
                        {t('availablePoints')}:{' '}
                        <strong>
                            {availablePoints} {t('pts')}
                        </strong>
                    </p>
                </div>
            </div>

            <div className="rewards-filters">
                <button
                    onClick={() => setFilter('all')}
                    className={`rewards-filter-button ${filter === 'all' ? 'rewards-filter-active' : ''}`}>
                    {t('allRewards')}
                </button>
                <button
                    onClick={() => setFilter('available')}
                    className={`rewards-filter-button ${filter === 'available' ? 'rewards-filter-active' : ''}`}>
                    {t('availableNow')} ({availableRewards.length})
                </button>
                <button
                    onClick={() => setFilter('popular')}
                    className={`rewards-filter-button ${filter === 'popular' ? 'rewards-filter-active' : ''}`}>
                    {t('popular')}
                </button>
            </div>

            <div className="rewards-grid">
                {displayedRewards.map((reward) => {
                    const canRedeemReward = canRedeem(reward)
                    const isRedeeming = redeeming === reward.id

                    return (
                        <div
                            key={reward.id}
                            className={`reward-card ${canRedeemReward ? '' : 'reward-card-locked'}`}>
                            {reward.isPopular && (
                                <div className="reward-badge reward-badge-popular">
                                    <BiStar /> {t('popular')}
                                </div>
                            )}

                            {reward.minTier && (
                                <div className="reward-badge reward-badge-tier">
                                    {t('tierRequired', { tier: reward.minTier })}
                                </div>
                            )}

                            <div className="reward-icon-large">{reward.icon}</div>

                            <h4 className="reward-name">{reward.name}</h4>

                            <p className="reward-description">{reward.description}</p>

                            <div className="reward-type-badge">{t(`type.${reward.type}`)}</div>

                            {reward.value > 0 && (
                                <div className="reward-value">
                                    {reward.type === 'discount' && (
                                        <>
                                            <BiDollar className="reward-value-icon" />
                                            <span>
                                                {reward.value} {t('value')}
                                            </span>
                                        </>
                                    )}
                                    {reward.type !== 'discount' && (
                                        <span>
                                            {t('worth')} ${reward.value}
                                        </span>
                                    )}
                                </div>
                            )}

                            {reward.expiryDays && (
                                <p className="reward-expiry">
                                    {t('expires', { days: reward.expiryDays })}
                                </p>
                            )}

                            <div className="reward-cost">
                                <span className="reward-cost-icon">⭐</span>
                                <span className="reward-cost-value">
                                    {reward.pointsCost} {t('pts')}
                                </span>
                            </div>

                            <button
                                onClick={() => handleRedeem(reward)}
                                disabled={!canRedeemReward || isRedeeming}
                                className={`reward-redeem-button ${
                                    canRedeemReward ? '' : 'reward-redeem-button-locked'
                                }`}>
                                {isRedeeming
                                    ? t('redeeming')
                                    : canRedeemReward
                                      ? t('redeem')
                                      : !canRedeemReward && availablePoints < reward.pointsCost
                                        ? t('needPoints', {
                                              points: reward.pointsCost - availablePoints
                                          })
                                        : t('locked')}
                            </button>
                        </div>
                    )
                })}
            </div>

            {displayedRewards.length === 0 && (
                <div className="rewards-empty">
                    <p>{t('noRewardsAvailable')}</p>
                    <p className="rewards-empty-hint">{t('earnMorePoints')}</p>
                </div>
            )}
        </div>
    )
}
