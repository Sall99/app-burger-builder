'use client'

import React from 'react'
import { BiTrophy } from 'react-icons/bi'
import { useSelector } from 'react-redux'
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
        <div className="loyalty-dashboard">
            <div className="loyalty-header">
                <BiTrophy className="loyalty-icon" aria-hidden="true" />
                <div>
                    <h3 className="loyalty-title">{t('title')}</h3>
                    <p className="loyalty-subtitle">{t('subtitle')}</p>
                </div>
            </div>

            <div
                className="loyalty-tier-card"
                style={{
                    background: tierInfo.gradient,
                    border: `2px solid ${tierInfo.color}`
                }}>
                <div className="loyalty-tier-header">
                    <span className="loyalty-tier-icon">{tierInfo.icon}</span>
                    <div>
                        <h4 className="loyalty-tier-name">{tierInfo.name}</h4>
                        <p className="loyalty-tier-multiplier">
                            {t('earnMultiplier', { multiplier: tierInfo.pointsMultiplier })}
                        </p>
                    </div>
                </div>

                <div className="loyalty-points-display">
                    <div className="loyalty-points-item">
                        <span className="loyalty-points-value">{totalPoints}</span>
                        <span className="loyalty-points-label">{t('totalPoints')}</span>
                    </div>
                    <div className="loyalty-points-divider"></div>
                    <div className="loyalty-points-item">
                        <span className="loyalty-points-value">{availablePoints}</span>
                        <span className="loyalty-points-label">{t('available')}</span>
                    </div>
                </div>

                {nextTier && (
                    <div className="loyalty-progress-section">
                        <div className="loyalty-progress-header">
                            <span className="loyalty-progress-text">
                                {t('progressTo', { tier: nextTier.name })}
                            </span>
                            <span className="loyalty-progress-points">
                                {progress.current} / {progress.needed} {t('points')}
                            </span>
                        </div>
                        <div className="loyalty-progress-bar">
                            <div
                                className="loyalty-progress-fill"
                                style={{
                                    width: `${progress.percentage}%`,
                                    background: nextTier.gradient
                                }}></div>
                        </div>
                    </div>
                )}

                {!nextTier && (
                    <div className="loyalty-max-tier">
                        <span className="loyalty-max-tier-icon">🎉</span>
                        <span className="loyalty-max-tier-text">{t('maxTierAchieved')}</span>
                    </div>
                )}
            </div>

            <div className="loyalty-stats-grid">
                <div className="loyalty-stat-card">
                    <span className="loyalty-stat-icon">💰</span>
                    <span className="loyalty-stat-value">${lifetimeSpend.toFixed(2)}</span>
                    <span className="loyalty-stat-label">{t('lifetimeSpend')}</span>
                </div>
                <div className="loyalty-stat-card">
                    <span className="loyalty-stat-icon">🍔</span>
                    <span className="loyalty-stat-value">{ordersCount}</span>
                    <span className="loyalty-stat-label">{t('orders')}</span>
                </div>
            </div>

            <div className="loyalty-benefits">
                <h5 className="loyalty-benefits-title">{t('yourBenefits')}</h5>
                <ul className="loyalty-benefits-list">
                    {tierInfo.benefits.map((benefit, index) => (
                        <li key={index} className="loyalty-benefit-item">
                            <span className="loyalty-benefit-check">✓</span>
                            <span>{benefit}</span>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="loyalty-tiers-preview">
                <h5 className="loyalty-tiers-title">{t('allTiers')}</h5>
                <div className="loyalty-tiers-grid">
                    {(Object.keys(LOYALTY_TIERS) as LoyaltyTier[]).map((tier) => {
                        const info = LOYALTY_TIERS[tier]
                        const isCurrentTier = tier === currentTier
                        const isUnlocked = totalPoints >= info.minPoints

                        return (
                            <div
                                key={tier}
                                className={`loyalty-tier-mini ${isCurrentTier ? 'loyalty-tier-mini-active' : ''} ${
                                    !isUnlocked ? 'loyalty-tier-mini-locked' : ''
                                }`}
                                style={{
                                    borderColor: info.color
                                }}>
                                <span className="loyalty-tier-mini-icon">{info.icon}</span>
                                <span className="loyalty-tier-mini-name">{info.name}</span>
                                <span className="loyalty-tier-mini-points">
                                    {info.minPoints}+ {t('pts')}
                                </span>
                                {isCurrentTier && (
                                    <span className="loyalty-tier-mini-badge">{t('current')}</span>
                                )}
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
