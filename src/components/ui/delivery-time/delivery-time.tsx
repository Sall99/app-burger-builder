'use client'

import React, { useMemo } from 'react'
import { BiTimeFive } from 'react-icons/bi'
import { MdDeliveryDining } from 'react-icons/md'
import { useSelector } from 'react-redux'
import { useTranslations } from 'next-intl'

import { selectIngredients } from '@/redux/selectors/ingredients'
import {
    calculateDeliveryTime,
    formatDeliveryTime,
    formatDeliveryTimeString,
    getDeliveryTimeRange
} from '@/utils/delivery-time-calculator'

export const DeliveryTime: React.FC = () => {
    const t = useTranslations('DeliveryTime')
    const { ingredients } = useSelector(selectIngredients)

    const deliveryEstimate = useMemo(() => {
        return calculateDeliveryTime(ingredients, {
            distance: 5
        })
    }, [ingredients])

    const timeRange = getDeliveryTimeRange(deliveryEstimate.totalTime)
    const deliveryTimeStr = formatDeliveryTimeString(deliveryEstimate.estimatedDelivery)

    return (
        <div className="delivery-time-container">
            <div className="delivery-time-header">
                <MdDeliveryDining className="delivery-icon" aria-hidden="true" />
                <div className="delivery-time-content">
                    <h3 className="delivery-time-title">{t('title')}</h3>
                    <div className="delivery-time-estimate">
                        <span className="delivery-time-main">
                            {timeRange.min}-{timeRange.max} {t('minutes')}
                        </span>
                        <span className="delivery-time-clock">
                            <BiTimeFive aria-hidden="true" />
                            {t('by')} {deliveryTimeStr}
                        </span>
                    </div>
                </div>
            </div>

            {deliveryEstimate.isPeakHour && (
                <div className="delivery-time-peak-warning">
                    <span className="delivery-peak-badge">{t('peakHours')}</span>
                    <span className="delivery-peak-text">{t('peakHoursMessage')}</span>
                </div>
            )}

            <div className="delivery-time-breakdown">
                <div className="delivery-breakdown-item">
                    <span className="delivery-breakdown-label">{t('preparation')}</span>
                    <span className="delivery-breakdown-value">
                        {formatDeliveryTime(deliveryEstimate.prepTime)}
                    </span>
                </div>
                <div className="delivery-breakdown-divider">+</div>
                <div className="delivery-breakdown-item">
                    <span className="delivery-breakdown-label">{t('delivery')}</span>
                    <span className="delivery-breakdown-value">
                        {formatDeliveryTime(deliveryEstimate.deliveryTime)}
                    </span>
                </div>
            </div>

            <div className="delivery-time-note">{t('note')}</div>
        </div>
    )
}
