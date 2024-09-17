'use client'

import { useTranslations } from 'next-intl'

import { IngredientTypes } from '@/types'

export const BurgerIngredients = (props: IngredientTypes) => {
    const t = useTranslations('Ingredients')
    let ingredients

    switch (props.type) {
        case 'BreadBottom':
            ingredients = <div className="BreadBottom" aria-label={t('BreadBottom')}></div>
            break
        case 'BreadTop':
            ingredients = (
                <div className="BreadTop" aria-label={t('BreadTop')}>
                    <div className="Seeds1"></div>
                    <div className="Seeds2"></div>
                </div>
            )
            break
        case 'meat':
            ingredients = <div className="Meat" aria-label={t('Meat')}></div>
            break
        case 'cheese':
            ingredients = <div className="Cheese" aria-label={t('Cheese')}></div>
            break
        case 'salad':
            ingredients = <div className="Salad" aria-label={t('Salad')}></div>
            break
        case 'bacon':
            ingredients = <div className="Bacon" aria-label={t('Bacon')}></div>
            break
        default:
            return (ingredients = null)
    }
    return ingredients
}
