'use client'

import React from 'react'
import { useSelector } from 'react-redux'
import { AlertTriangle, Leaf } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { selectIngredients } from '@/redux/selectors/ingredients'
import {
    calculateBurgerDietaryInfo,
    getAllergenList,
    getDietaryTags
} from '@/utils/dietary-calculator'

export const DietaryInfo: React.FC = () => {
    const t = useTranslations('Dietary')
    const { ingredients } = useSelector(selectIngredients)

    const dietaryInfo = calculateBurgerDietaryInfo(ingredients)
    const allergenList = getAllergenList(dietaryInfo.allergens)
    const dietaryTags = getDietaryTags(dietaryInfo)

    const metrics = [
        { label: t('calories'), value: dietaryInfo.totalNutrition.calories, unit: 'kcal' },
        { label: t('protein'), value: dietaryInfo.totalNutrition.protein, unit: 'g' },
        { label: t('carbs'), value: dietaryInfo.totalNutrition.carbs, unit: 'g' },
        { label: t('fat'), value: dietaryInfo.totalNutrition.fat, unit: 'g' },
        { label: t('fiber'), value: dietaryInfo.totalNutrition.fiber, unit: 'g' },
        { label: t('sodium'), value: dietaryInfo.totalNutrition.sodium, unit: 'mg' }
    ]

    return (
        <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-zinc-950">{t('nutritionalInfo')}</h3>
                <span className="text-xs font-semibold text-orange-600 tabular-nums">
                    {dietaryInfo.totalNutrition.calories} kcal
                </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
                {metrics.map((m) => (
                    <div
                        key={m.label}
                        className="rounded-xl border border-zinc-100 bg-zinc-50/80 px-3 py-2.5 text-center">
                        <p className="text-sm font-bold text-zinc-950 tabular-nums">
                            {m.value}
                            <span className="ml-0.5 text-[10px] font-medium text-zinc-400">
                                {m.unit}
                            </span>
                        </p>
                        <p className="text-[11px] text-zinc-500 truncate">{m.label}</p>
                    </div>
                ))}
            </div>

            {dietaryTags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                    {dietaryTags.map((tag) => (
                        <span
                            key={tag}
                            className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                            <Leaf size={11} />
                            {t(`tags.${tag}`)}
                        </span>
                    ))}
                </div>
            )}

            {allergenList.length > 0 && (
                <div className="flex items-start gap-2.5 rounded-xl bg-amber-50/70 border border-amber-200/70 p-3 text-xs">
                    <AlertTriangle size={14} className="mt-0.5 shrink-0 text-amber-600" />
                    <div className="space-y-1.5">
                        <p className="font-semibold text-amber-950">{t('allergenWarning')}</p>
                        <div className="flex flex-wrap gap-1">
                            {allergenList.map((allergen) => (
                                <span
                                    key={allergen}
                                    className="rounded-md bg-white px-2 py-0.5 text-[11px] font-medium text-amber-900 border border-amber-200">
                                    {t(`allergenList.${allergen}`)}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
