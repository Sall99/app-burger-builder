'use client'

import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { Clock, Truck } from 'lucide-react'
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

    const deliveryEstimate = useMemo(
        () => calculateDeliveryTime(ingredients, { distance: 5 }),
        [ingredients]
    )

    const timeRange = getDeliveryTimeRange(deliveryEstimate.totalTime)
    const deliveryTimeStr = formatDeliveryTimeString(deliveryEstimate.estimatedDelivery)

    return (
        <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 space-y-3">
            <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                    <Truck size={15} className="text-zinc-500" />
                    <h3 className="text-sm font-semibold text-zinc-950">{t('title')}</h3>
                </div>
                <span className="inline-flex items-center gap-1 text-xs font-medium text-zinc-500">
                    <Clock size={12} />
                    {t('by')} {deliveryTimeStr}
                </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
                <div className="rounded-xl bg-zinc-50 border border-zinc-100 p-2.5">
                    <p className="text-sm font-bold text-zinc-950 tabular-nums">
                        {timeRange.min}–{timeRange.max}m
                    </p>
                    <p className="text-[11px] text-zinc-500">Total</p>
                </div>
                <div className="rounded-xl bg-zinc-50 border border-zinc-100 p-2.5">
                    <p className="text-sm font-bold text-zinc-950 tabular-nums">
                        {formatDeliveryTime(deliveryEstimate.prepTime)}
                    </p>
                    <p className="text-[11px] text-zinc-500">{t('preparation')}</p>
                </div>
                <div className="rounded-xl bg-zinc-50 border border-zinc-100 p-2.5">
                    <p className="text-sm font-bold text-zinc-950 tabular-nums">
                        {formatDeliveryTime(deliveryEstimate.deliveryTime)}
                    </p>
                    <p className="text-[11px] text-zinc-500">{t('delivery')}</p>
                </div>
            </div>
        </div>
    )
}
