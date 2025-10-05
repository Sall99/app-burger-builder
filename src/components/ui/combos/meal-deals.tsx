'use client'

import React, { useState } from 'react'
import { BiDollar, BiStar } from 'react-icons/bi'
import { MdLocalOffer } from 'react-icons/md'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslations } from 'next-intl'

import { selectCombo } from '@/redux/selectors/combo'
import { selectIngredients } from '@/redux/selectors/ingredients'
import { applyCombo, clearCombo } from '@/redux/slices/combo'
import { clearIngredients, setIngredients } from '@/redux/slices/ingredients-enhanced'
import { COMBOS, calculateComboSavings, type Combo } from '@/types/combos'
import { totalFormatter } from '@/utils/utils'

export const MealDeals: React.FC = () => {
    const t = useTranslations('Combos')
    const dispatch = useDispatch()
    const { ingredients } = useSelector(selectIngredients)
    const { selectedCombo, isComboApplied } = useSelector(selectCombo)
    const [showAll, setShowAll] = useState(false)

    // Check if current ingredients match a combo
    const { bestCombo } = calculateComboSavings(ingredients)

    // Show only popular combos by default, or all if clicked
    const displayedCombos = showAll ? COMBOS : COMBOS.filter((c) => c.isPopular || c.isDealOfTheDay)

    const handleApplyCombo = (combo: Combo) => {
        // Apply combo to Redux
        dispatch(applyCombo(combo))

        // Set ingredients to match combo
        dispatch(setIngredients(combo.ingredients))

        // Announce for accessibility
        if (typeof window !== 'undefined') {
            const announcement = `Applied ${combo.name} combo. Saved ${totalFormatter.format(combo.savings)}`
            const ariaLive = document.createElement('div')
            ariaLive.setAttribute('role', 'status')
            ariaLive.setAttribute('aria-live', 'polite')
            ariaLive.className = 'sr-only'
            ariaLive.textContent = announcement
            document.body.appendChild(ariaLive)
            setTimeout(() => document.body.removeChild(ariaLive), 1000)
        }
    }

    const handleClearCombo = () => {
        dispatch(clearCombo())
        dispatch(clearIngredients())
    }

    return (
        <div className="combos-container">
            {/* Header */}
            <div className="combos-header">
                <MdLocalOffer className="combos-icon" aria-hidden="true" />
                <div>
                    <h3 className="combos-title">{t('title')}</h3>
                    <p className="combos-subtitle">{t('subtitle')}</p>
                </div>
            </div>

            {/* Combo Suggestion */}
            {bestCombo && !isComboApplied && (
                <div className="combo-suggestion">
                    <div className="combo-suggestion-content">
                        <span className="combo-suggestion-icon">💡</span>
                        <div>
                            <p className="combo-suggestion-text">
                                {t('suggestionText', { name: bestCombo.name })}
                            </p>
                            <p className="combo-suggestion-savings">
                                {t('save')} {totalFormatter.format(bestCombo.savings)}!
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => handleApplyCombo(bestCombo)}
                        className="combo-suggestion-button">
                        {t('applyNow')}
                    </button>
                </div>
            )}

            {/* Active Combo Banner */}
            {isComboApplied && selectedCombo && (
                <div className="combo-active-banner">
                    <div className="combo-active-content">
                        <span className="combo-active-icon">{selectedCombo.icon}</span>
                        <div>
                            <p className="combo-active-name">{selectedCombo.name}</p>
                            <p className="combo-active-savings">
                                {t('saving')} {totalFormatter.format(selectedCombo.savings)} (
                                {selectedCombo.savingsPercentage}% {t('off')})
                            </p>
                        </div>
                    </div>
                    <button onClick={handleClearCombo} className="combo-clear-button">
                        {t('clearCombo')}
                    </button>
                </div>
            )}

            {/* Combos Grid */}
            <div className="combos-grid">
                {displayedCombos.map((combo) => {
                    const isActive = isComboApplied && selectedCombo?.id === combo.id

                    return (
                        <div
                            key={combo.id}
                            className={`combo-card ${isActive ? 'combo-card-active' : ''}`}>
                            {/* Deal of the Day Badge */}
                            {combo.isDealOfTheDay && (
                                <div className="combo-badge combo-badge-deal">
                                    <BiStar /> {t('dealOfTheDay')}
                                </div>
                            )}

                            {/* Popular Badge */}
                            {combo.isPopular && !combo.isDealOfTheDay && (
                                <div className="combo-badge combo-badge-popular">
                                    {t('popular')}
                                </div>
                            )}

                            {/* Combo Icon */}
                            <div className="combo-icon-large">{combo.icon}</div>

                            {/* Combo Name */}
                            <h4 className="combo-name">{combo.name}</h4>

                            {/* Combo Description */}
                            <p className="combo-description">{combo.description}</p>

                            {/* Ingredients */}
                            <div className="combo-ingredients">
                                {combo.ingredients.meat > 0 && (
                                    <span className="combo-ingredient">
                                        🍔 {combo.ingredients.meat}x {t('ingredients.meat')}
                                    </span>
                                )}
                                {combo.ingredients.cheese > 0 && (
                                    <span className="combo-ingredient">
                                        🧀 {combo.ingredients.cheese}x {t('ingredients.cheese')}
                                    </span>
                                )}
                                {combo.ingredients.salad > 0 && (
                                    <span className="combo-ingredient">
                                        🥬 {combo.ingredients.salad}x {t('ingredients.salad')}
                                    </span>
                                )}
                                {combo.ingredients.bacon > 0 && (
                                    <span className="combo-ingredient">
                                        🥓 {combo.ingredients.bacon}x {t('ingredients.bacon')}
                                    </span>
                                )}
                            </div>

                            {/* Pricing */}
                            <div className="combo-pricing">
                                <div className="combo-price-regular">
                                    <span className="combo-price-label">{t('regular')}:</span>
                                    <span className="combo-price-value combo-price-strikethrough">
                                        {totalFormatter.format(combo.regularPrice)}
                                        <BiDollar />
                                    </span>
                                </div>
                                <div className="combo-price-combo">
                                    <span className="combo-price-label">{t('comboPrice')}:</span>
                                    <span className="combo-price-value combo-price-highlight">
                                        {totalFormatter.format(combo.comboPrice)}
                                        <BiDollar />
                                    </span>
                                </div>
                                <div className="combo-savings-badge">
                                    {t('save')} {totalFormatter.format(combo.savings)} (
                                    {combo.savingsPercentage}% {t('off')})
                                </div>
                            </div>

                            {/* Apply Button */}
                            <button
                                onClick={() => handleApplyCombo(combo)}
                                disabled={isActive}
                                className={`combo-apply-button ${isActive ? 'combo-apply-button-active' : ''}`}>
                                {isActive ? t('applied') : t('selectCombo')}
                            </button>
                        </div>
                    )
                })}
            </div>

            {/* Show More/Less Button */}
            {COMBOS.length > displayedCombos.length && (
                <div className="combos-show-more">
                    <button
                        onClick={() => setShowAll(!showAll)}
                        className="combos-show-more-button">
                        {showAll ? t('showLess') : t('showMore')}
                    </button>
                </div>
            )}
        </div>
    )
}
