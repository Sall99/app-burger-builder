'use client'

import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Check, Sparkles, X } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { selectCombo } from '@/redux/selectors/combo'
import { selectIngredients } from '@/redux/selectors/ingredients'
import { applyCombo, clearCombo } from '@/redux/slices/combo'
import { clearIngredients, setIngredients } from '@/redux/slices/ingredients-enhanced'
import { calculateComboSavings, type Combo, COMBOS } from '@/types/combos'
import { totalFormatter } from '@/utils/utils'

export const MealDeals: React.FC = () => {
    const t = useTranslations('Combos')
    const dispatch = useDispatch()
    const { ingredients } = useSelector(selectIngredients)
    const { selectedCombo, isComboApplied } = useSelector(selectCombo)
    const [showAll, setShowAll] = useState(false)

    const { bestCombo } = calculateComboSavings(ingredients)
    const displayedCombos = showAll ? COMBOS : COMBOS.filter((c) => c.isPopular || c.isDealOfTheDay)

    const handleApplyCombo = (combo: Combo) => {
        dispatch(applyCombo(combo))
        dispatch(setIngredients(combo.ingredients))
    }

    const handleClearCombo = () => {
        dispatch(clearCombo())
        dispatch(clearIngredients())
    }

    return (
        <div className="space-y-3">
            {bestCombo && !isComboApplied && (
                <div className="flex items-center justify-between gap-3 rounded-2xl border border-orange-200 bg-orange-50/70 px-4 py-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                        <Sparkles size={15} className="shrink-0 text-orange-500" />
                        <p className="truncate text-xs font-medium text-zinc-800">
                            {t('suggestionText', { name: bestCombo.name })} —{' '}
                            <span className="font-semibold text-orange-600">
                                {t('save')} {totalFormatter.format(bestCombo.savings)}
                            </span>
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() => handleApplyCombo(bestCombo)}
                        className="shrink-0 rounded-lg bg-zinc-950 px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-zinc-800">
                        {t('applyNow')}
                    </button>
                </div>
            )}

            {isComboApplied && selectedCombo && (
                <div className="flex items-center justify-between gap-3 rounded-2xl border border-emerald-200 bg-emerald-50/70 px-4 py-3">
                    <p className="text-xs font-medium text-emerald-800">
                        <strong>{selectedCombo.name}</strong> · {t('saving')}{' '}
                        {totalFormatter.format(selectedCombo.savings)}
                    </p>
                    <button
                        type="button"
                        onClick={handleClearCombo}
                        className="inline-flex items-center gap-1 rounded-lg bg-white px-2.5 py-1 text-[11px] font-semibold text-zinc-700 border border-emerald-200 hover:bg-emerald-50">
                        <X size={12} />
                        {t('clearCombo')}
                    </button>
                </div>
            )}

            <div className="divide-y divide-zinc-100 rounded-2xl border border-zinc-200/80 bg-white overflow-hidden">
                {displayedCombos.map((combo) => {
                    const isActive = isComboApplied && selectedCombo?.id === combo.id
                    return (
                        <div
                            key={combo.id}
                            className={`flex items-center justify-between gap-4 p-4 transition-colors ${
                                isActive ? 'bg-orange-50/40' : 'hover:bg-zinc-50/70'
                            }`}>
                            <div className="min-w-0 space-y-1">
                                <div className="flex items-center gap-2">
                                    <span className="text-base leading-none">{combo.icon}</span>
                                    <h4 className="text-sm font-semibold text-zinc-950 truncate">
                                        {combo.name}
                                    </h4>
                                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                                        -{combo.savingsPercentage}%
                                    </span>
                                </div>
                                <p className="text-xs text-zinc-500 line-clamp-1">
                                    {combo.description}
                                </p>
                            </div>

                            <div className="flex shrink-0 items-center gap-3">
                                <div className="text-right">
                                    <span className="block text-[11px] text-zinc-400 line-through tabular-nums">
                                        {totalFormatter.format(combo.regularPrice)}
                                    </span>
                                    <span className="text-sm font-bold text-zinc-950 tabular-nums">
                                        {totalFormatter.format(combo.comboPrice)}
                                    </span>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => handleApplyCombo(combo)}
                                    disabled={isActive}
                                    className={`inline-flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                                        isActive
                                            ? 'bg-emerald-600 text-white'
                                            : 'border border-zinc-200 bg-white text-zinc-900 hover:border-zinc-950 hover:bg-zinc-950 hover:text-white'
                                    }`}>
                                    {isActive && <Check size={12} />}
                                    <span>{isActive ? t('applied') : t('selectCombo')}</span>
                                </button>
                            </div>
                        </div>
                    )
                })}
            </div>

            {COMBOS.length > 3 && (
                <button
                    type="button"
                    onClick={() => setShowAll(!showAll)}
                    className="w-full rounded-xl border border-zinc-200 py-2 text-xs font-medium text-zinc-600 hover:bg-zinc-50 hover:text-zinc-950 transition-colors">
                    {showAll ? t('showLess') : t('showMore')}
                </button>
            )}
        </div>
    )
}
