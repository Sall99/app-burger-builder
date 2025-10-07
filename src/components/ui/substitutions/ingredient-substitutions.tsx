'use client'

import React, { useState } from 'react'
import { BiRefresh } from 'react-icons/bi'
import { MdSwapHoriz } from 'react-icons/md'
import { useDispatch, useSelector } from 'react-redux'
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
    const [expandedIngredient, setExpandedIngredient] = useState<string | null>(null)

    const availableIngredients = Object.entries(ingredients).filter(([, count]) => count > 0)

    if (availableIngredients.length === 0) {
        return (
            <div className="substitutions-empty">
                <p>{t('addIngredientsFirst')}</p>
            </div>
        )
    }

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

    const isSubstituted = (ingredient: string) => {
        return appliedSubstitutions.some((sub) => sub.originalIngredient === ingredient)
    }

    const getActiveSubstitution = (ingredient: string) => {
        return appliedSubstitutions.find((sub) => sub.originalIngredient === ingredient)
    }

    return (
        <div className="substitutions-container">
            {/* Header */}
            <div className="substitutions-header">
                <MdSwapHoriz className="substitutions-icon" aria-hidden="true" />
                <div>
                    <h3 className="substitutions-title">{t('title')}</h3>
                    <p className="substitutions-subtitle">{t('subtitle')}</p>
                </div>
            </div>

            <div className="substitutions-list">
                {availableIngredients.map(([ingredient, count]) => {
                    const substitutions = getSubstitutionsForIngredient(ingredient)
                    const activeSub = getActiveSubstitution(ingredient)
                    const isExpanded = expandedIngredient === ingredient

                    if (substitutions.length === 0) return null

                    return (
                        <div key={ingredient} className="substitution-item">
                            <button
                                onClick={() =>
                                    setExpandedIngredient(isExpanded ? null : ingredient)
                                }
                                className="substitution-ingredient-header"
                                aria-expanded={isExpanded}>
                                <div className="substitution-ingredient-info">
                                    <span className="substitution-ingredient-name">
                                        {t(`ingredients.${ingredient}`)}
                                    </span>
                                    <span className="substitution-ingredient-count">×{count}</span>
                                </div>
                                {activeSub && (
                                    <span className="substitution-active-badge">
                                        {t('substituted')}
                                    </span>
                                )}
                                <svg
                                    className={`substitution-chevron ${isExpanded ? 'substitution-chevron-open' : ''}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    aria-hidden="true">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 9l-7 7-7-7"
                                    />
                                </svg>
                            </button>

                            {isExpanded && (
                                <div className="substitution-options">
                                    {activeSub && (
                                        <button
                                            onClick={() => handleRemoveSubstitution(ingredient)}
                                            className="substitution-option substitution-option-reset">
                                            <BiRefresh className="substitution-option-icon" />
                                            <div className="substitution-option-content">
                                                <span className="substitution-option-name">
                                                    {t('resetToOriginal')}
                                                </span>
                                                <span className="substitution-option-desc">
                                                    {t(`ingredients.${ingredient}`)}
                                                </span>
                                            </div>
                                        </button>
                                    )}

                                    {substitutions.map((sub) => {
                                        const isActive = activeSub?.substitutionId === sub.id

                                        return (
                                            <button
                                                key={sub.id}
                                                onClick={() => handleApplySubstitution(sub)}
                                                className={`substitution-option ${isActive ? 'substitution-option-active' : ''}`}
                                                disabled={isActive}>
                                                {sub.icon && (
                                                    <span className="substitution-option-icon">
                                                        {sub.icon}
                                                    </span>
                                                )}
                                                <div className="substitution-option-content">
                                                    <span className="substitution-option-name">
                                                        {sub.name}
                                                        {sub.isDietary && (
                                                            <span className="substitution-dietary-badge">
                                                                {t(`dietary.${sub.dietaryType}`)}
                                                            </span>
                                                        )}
                                                    </span>
                                                    <span className="substitution-option-desc">
                                                        {sub.description}
                                                    </span>
                                                </div>
                                                <span
                                                    className={`substitution-option-price ${
                                                        sub.priceAdjustment > 0
                                                            ? 'substitution-price-positive'
                                                            : sub.priceAdjustment < 0
                                                              ? 'substitution-price-negative'
                                                              : ''
                                                    }`}>
                                                    {sub.priceAdjustment > 0 && '+'}
                                                    {sub.priceAdjustment !== 0 &&
                                                        totalFormatter.format(sub.priceAdjustment)}
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
            </div>

            {totalAdjustment !== 0 && (
                <div className="substitutions-total">
                    <span>{t('totalAdjustment')}:</span>
                    <span
                        className={`substitutions-total-amount ${
                            totalAdjustment > 0
                                ? 'substitutions-total-positive'
                                : 'substitutions-total-negative'
                        }`}>
                        {totalAdjustment > 0 && '+'}
                        {totalFormatter.format(totalAdjustment)}
                    </span>
                </div>
            )}
        </div>
    )
}
