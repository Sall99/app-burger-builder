'use client'

import React, { useState } from 'react'
import { AiFillInfoCircle } from 'react-icons/ai'
import { BiLeaf } from 'react-icons/bi'
import { MdWarning } from 'react-icons/md'
import { useSelector } from 'react-redux'
import clsx from 'clsx'
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
    const [isExpanded, setIsExpanded] = useState(false)

    const dietaryInfo = calculateBurgerDietaryInfo(ingredients)
    const allergenList = getAllergenList(dietaryInfo.allergens)
    const dietaryTags = getDietaryTags(dietaryInfo)

    return (
        <div className="dietary-info-container">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="dietary-header"
                aria-expanded={isExpanded}
                aria-controls="dietary-details">
                <div className="dietary-header-content">
                    <AiFillInfoCircle className="dietary-icon" aria-hidden="true" />
                    <div className="dietary-header-text">
                        <h3 className="dietary-title">{t('title')}</h3>
                        <p className="dietary-summary">
                            {dietaryInfo.totalNutrition.calories} {t('calories')}
                            {allergenList.length > 0 && (
                                <span className="dietary-allergen-count">
                                    • {allergenList.length} {t('allergens')}
                                </span>
                            )}
                        </p>
                    </div>
                </div>
                <div className="dietary-header-right">
                    {dietaryTags.length > 0 && (
                        <div className="dietary-tags-desktop">
                            {dietaryTags.map((tag) => (
                                <span key={tag} className="dietary-tag">
                                    <BiLeaf aria-hidden="true" />
                                    {t(`tags.${tag}`)}
                                </span>
                            ))}
                        </div>
                    )}
                    <svg
                        className={clsx('dietary-chevron', isExpanded && 'dietary-chevron-open')}
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
                </div>
            </button>

            {isExpanded && (
                <div id="dietary-details" className="dietary-content">
                    <div className="dietary-section">
                        <h4 className="dietary-section-title">{t('nutritionalInfo')}</h4>
                        <div className="dietary-nutrition-grid">
                            <NutritionItem
                                label={t('calories')}
                                value={dietaryInfo.totalNutrition.calories}
                                unit="kcal"
                            />
                            <NutritionItem
                                label={t('protein')}
                                value={dietaryInfo.totalNutrition.protein}
                                unit="g"
                            />
                            <NutritionItem
                                label={t('carbs')}
                                value={dietaryInfo.totalNutrition.carbs}
                                unit="g"
                            />
                            <NutritionItem
                                label={t('fat')}
                                value={dietaryInfo.totalNutrition.fat}
                                unit="g"
                            />
                            <NutritionItem
                                label={t('fiber')}
                                value={dietaryInfo.totalNutrition.fiber}
                                unit="g"
                            />
                            <NutritionItem
                                label={t('sodium')}
                                value={dietaryInfo.totalNutrition.sodium}
                                unit="mg"
                            />
                        </div>
                    </div>

                    {allergenList.length > 0 && (
                        <div className="dietary-allergen-section">
                            <div className="dietary-allergen-content">
                                <MdWarning className="dietary-warning-icon" aria-hidden="true" />
                                <div>
                                    <h4 className="dietary-allergen-title">
                                        {t('allergenWarning')}
                                    </h4>
                                    <div className="dietary-allergen-list">
                                        {allergenList.map((allergen) => (
                                            <span key={allergen} className="dietary-allergen-badge">
                                                {t(`allergenList.${allergen}`)}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {dietaryTags.length > 0 && (
                        <div className="dietary-tags-mobile">
                            <h4 className="dietary-section-title">{t('dietaryTags')}</h4>
                            <div className="dietary-tags-list">
                                {dietaryTags.map((tag) => (
                                    <span key={tag} className="dietary-tag">
                                        <BiLeaf aria-hidden="true" />
                                        {t(`tags.${tag}`)}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="dietary-disclaimer">{t('disclaimer')}</div>
                </div>
            )}
        </div>
    )
}

interface NutritionItemProps {
    label: string
    value: number
    unit: string
}

const NutritionItem: React.FC<NutritionItemProps> = ({ label, value, unit }) => (
    <div className="nutrition-item">
        <div className="nutrition-value">
            {value}
            <span className="nutrition-unit">{unit}</span>
        </div>
        <div className="nutrition-label">{label}</div>
    </div>
)
