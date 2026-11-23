'use client'

import { useTranslations } from 'next-intl'

import { IngredientTypes } from '@/types'

import { BurgerLayerArt } from './burger-layer-artwork'

export const BurgerIngredients = (props: IngredientTypes) => {
    const t = useTranslations('Ingredients')

    switch (props.type) {
        case 'BreadBottom':
            return (
                <div className="BreadBottom" aria-label={t('BreadBottom')}>
                    <BurgerLayerArt type="BreadBottom" />
                </div>
            )
        case 'BreadTop':
            return (
                <div className="BreadTop" aria-label={t('BreadTop')}>
                    <div className="Seeds1 sr-only" />
                    <div className="Seeds2 sr-only" />
                    <BurgerLayerArt type="BreadTop" />
                </div>
            )
        case 'meat':
            return (
                <div className="Meat" aria-label={t('Meat')}>
                    <BurgerLayerArt type="meat" />
                </div>
            )
        case 'cheese':
            return (
                <div className="Cheese" aria-label={t('Cheese')}>
                    <BurgerLayerArt type="cheese" />
                </div>
            )
        case 'salad':
            return (
                <div className="Salad" aria-label={t('Salad')}>
                    <BurgerLayerArt type="salad" />
                </div>
            )
        case 'bacon':
            return (
                <div className="Bacon" aria-label={t('Bacon')}>
                    <BurgerLayerArt type="bacon" />
                </div>
            )
        default:
            return null
    }
}
