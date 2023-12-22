'use client'
import { IngredientTypes } from '@/types'

export const BurgerIngredients = (props: IngredientTypes) => {
    let ingredients
    switch (props.type) {
        case 'BreadBottom':
            ingredients = <div className="BreadBottom"></div>
            break
        case 'BreadTop':
            ingredients = (
                <div className="BreadTop">
                    <div className="Seeds1"></div>
                    <div className="Seeds2"></div>
                </div>
            )
            break
        case 'meat':
            ingredients = <div className="Meat"></div>
            break
        case 'cheese':
            ingredients = <div className="Cheese"></div>
            break
        case 'salad':
            ingredients = <div className="Salad"></div>
            break
        case 'bacon':
            ingredients = <div className="Bacon"></div>
            break

        default:
            return (ingredients = null)
    }
    return ingredients
}
