'use client'

import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ArrowLeftRight, ChevronDown, RotateCcw } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { selectIngredients } from '@/redux/selectors/ingredients'
import { selectSubstitutions } from '@/redux/selectors/substitutions'
import { applySubstitution, removeSubstitution } from '@/redux/slices/substitutions'
import { getSubstitutionsForIngredient, type Substitution } from '@/types/substitutions'
import { totalFormatter } from '@/utils/utils'

export const IngredientSubstitutions: React.FC = () => {
    const t = useTranslations('Substitutions')
    const dispatch = useDispatch()
    const { ingredients } = useSelector(selectIngredients)
    const { appliedSubstitutions, totalAdjustment } = useSelector(selectSubstitutions)
    const [isOpen, setIsOpen] = useState(false)
    const [expandedIngredient, setExpandedIngredient] = useState<string | null>(null)

    const availableIngredients = Object.entries(ingredients).filter(([, count]) => count > 0)

    if (availableIngredients.length === 0) return null

    const handleApplySubstitution = (substitution: Substitution) => {
        dispatch(
            applySubstitution({
                substitutionId: substitution.id,
                originalIngredient: substitution.originalIngredient,
                substituteIngredient: substitution.substituteIngredient,
                priceAdjustment: substitution.priceAdjustment
            })
        )
    }

    const handleRemoveSubstitution = (ingredient: string) => {
        dispatch(removeSubstitution(ingredient))
    }

    const getActiveSubstitution = (ingredient: string) =>
        appliedSubstitutions.find((sub) => sub.originalIngredient === ingredient)

    return (
        <div className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white">
            <button
                type="button"
                onClick={() => setIsOpen((prev) => !prev)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-zinc-50 transition-colors">
                <span className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-700">
                    <ArrowLeftRight size={14} className="text-zinc-400" />
                    <span>{t('title')}</span>
                    {appliedSubstitutions.length > 0 && (
                        <span className="rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-semibold text-orange-700">
                            {appliedSubstitutions.length}
                        </span>
                    )}
                </span>
                <ChevronDown
                    size={15}
                    className={`text-zinc-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>

            {isOpen && (
                <div className="border-t border-zinc-100 p-3 space-y-2 bg-zinc-50/40">
                    {availableIngredients.map(([ingredient, count]) => {
                        const substitutions = getSubstitutionsForIngredient(ingredient)
                        const activeSub = getActiveSubstitution(ingredient)
                        const isExpanded = expandedIngredient === ingredient
                        if (substitutions.length === 0) return null

                        return (
                            <div
                                key={ingredient}
                                className="overflow-hidden rounded-xl border border-zinc-200/70 bg-white">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setExpandedIngredient(isExpanded ? null : ingredient)
                                    }
                                    className="flex w-full items-center justify-between px-3.5 py-2.5 text-left text-xs font-semibold text-zinc-800 hover:bg-zinc-50">
                                    <span className="flex items-center gap-2">
                                        <span>{t(`ingredients.${ingredient}`)}</span>
                                        <span className="text-zinc-400">×{count}</span>
                                        {activeSub && (
                                            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                                                {t('substituted')}
                                            </span>
                                        )}
                                    </span>
                                    <ChevronDown
                                        size={14}
                                        className={`text-zinc-400 transition-transform ${
                                            isExpanded ? 'rotate-180' : ''
                                        }`}
                                    />
                                </button>

                                {isExpanded && (
                                    <div className="border-t border-zinc-100 p-2 space-y-1.5">
                                        {activeSub && (
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveSubstitution(ingredient)}
                                                className="flex w-full items-center gap-2 rounded-lg border border-dashed border-zinc-200 px-3 py-2 text-xs font-medium text-zinc-600 hover:bg-zinc-50">
                                                <RotateCcw size={13} />
                                                <span>{t('resetToOriginal')}</span>
                                            </button>
                                        )}

                                        {substitutions.map((sub) => {
                                            const isActive = activeSub?.substitutionId === sub.id
                                            return (
                                                <button
                                                    key={sub.id}
                                                    type="button"
                                                    onClick={() => handleApplySubstitution(sub)}
                                                    disabled={isActive}
                                                    className={`flex w-full items-center justify-between gap-2 rounded-lg border px-3 py-2 text-left text-xs transition-colors ${
                                                        isActive
                                                            ? 'border-zinc-950 bg-zinc-950 text-white'
                                                            : 'border-zinc-200/70 hover:border-zinc-400'
                                                    }`}>
                                                    <span className="font-medium truncate">
                                                        {sub.icon ? `${sub.icon} ` : ''}
                                                        {sub.name}
                                                    </span>
                                                    <span className="shrink-0 font-semibold tabular-nums">
                                                        {sub.priceAdjustment > 0 && '+'}
                                                        {sub.priceAdjustment < 0 && '-'}
                                                        {sub.priceAdjustment !== 0 &&
                                                            totalFormatter.format(
                                                                Math.abs(sub.priceAdjustment)
                                                            )}
                                                        {sub.priceAdjustment === 0 && t('free')}
                                                    </span>
                                                </button>
                                            )
                                        })}
                                    </div>
                                )}
                            </div>
                        )
                    })}

                    {totalAdjustment !== 0 && (
                        <div className="flex items-center justify-between px-2 pt-1 text-xs font-medium text-zinc-600">
                            <span>{t('totalAdjustment')}</span>
                            <span className="font-semibold text-zinc-950 tabular-nums">
                                {totalAdjustment > 0 ? '+' : ''}
                                {totalFormatter.format(totalAdjustment)}
                            </span>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
