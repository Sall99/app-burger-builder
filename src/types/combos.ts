/**
 * Meal Deals / Combos System
 * Pre-configured burger combinations with special pricing
 */

import type { Ingredients } from './index'

export interface Combo {
    id: string
    name: string
    description: string
    ingredients: Ingredients
    regularPrice: number
    comboPrice: number
    savings: number
    savingsPercentage: number
    isPopular?: boolean
    isDealOfTheDay?: boolean
    icon?: string
    dietaryTags?: string[]
}

/**
 * Available Combo Deals
 */
export const COMBOS: Combo[] = [
    {
        id: 'classic-burger',
        name: 'Classic Burger',
        description: 'The traditional favorite - beef, cheese, lettuce',
        ingredients: {
            meat: 1,
            cheese: 1,
            salad: 1,
            bacon: 0
        },
        regularPrice: 3.5,
        comboPrice: 2.99,
        savings: 0.51,
        savingsPercentage: 15,
        isPopular: true,
        icon: '🍔'
    },
    {
        id: 'bacon-deluxe',
        name: 'Bacon Deluxe',
        description: 'Loaded with bacon, cheese, and beef',
        ingredients: {
            meat: 2,
            cheese: 2,
            salad: 1,
            bacon: 2
        },
        regularPrice: 8.0,
        comboPrice: 6.99,
        savings: 1.01,
        savingsPercentage: 13,
        isPopular: true,
        icon: '🥓'
    },
    {
        id: 'veggie-delight',
        name: 'Veggie Delight',
        description: 'Healthy and delicious - extra veggies!',
        ingredients: {
            meat: 0,
            cheese: 1,
            salad: 3,
            bacon: 0
        },
        regularPrice: 2.5,
        comboPrice: 1.99,
        savings: 0.51,
        savingsPercentage: 20,
        icon: '🥗',
        dietaryTags: ['vegetarian']
    },
    {
        id: 'double-trouble',
        name: 'Double Trouble',
        description: 'Double the meat, double the flavor!',
        ingredients: {
            meat: 2,
            cheese: 2,
            salad: 1,
            bacon: 1
        },
        regularPrice: 6.5,
        comboPrice: 5.49,
        savings: 1.01,
        savingsPercentage: 16,
        isDealOfTheDay: true,
        icon: '🍔🍔'
    },
    {
        id: 'cheese-lover',
        name: 'Cheese Lover',
        description: 'Extra cheese on everything!',
        ingredients: {
            meat: 1,
            cheese: 3,
            salad: 1,
            bacon: 1
        },
        regularPrice: 5.5,
        comboPrice: 4.49,
        savings: 1.01,
        savingsPercentage: 18,
        icon: '🧀'
    },
    {
        id: 'light-bite',
        name: 'Light Bite',
        description: 'Perfect for a light meal',
        ingredients: {
            meat: 1,
            cheese: 1,
            salad: 2,
            bacon: 0
        },
        regularPrice: 3.0,
        comboPrice: 2.49,
        savings: 0.51,
        savingsPercentage: 17,
        icon: '🥬',
        dietaryTags: ['light']
    },
    {
        id: 'mega-meat',
        name: 'Mega Meat',
        description: 'For serious meat lovers only!',
        ingredients: {
            meat: 3,
            cheese: 2,
            salad: 1,
            bacon: 3
        },
        regularPrice: 10.5,
        comboPrice: 8.99,
        savings: 1.51,
        savingsPercentage: 14,
        icon: '🥩'
    },
    {
        id: 'simple-classic',
        name: 'Simple Classic',
        description: 'Just the basics, perfectly done',
        ingredients: {
            meat: 1,
            cheese: 1,
            salad: 0,
            bacon: 0
        },
        regularPrice: 2.5,
        comboPrice: 1.99,
        savings: 0.51,
        savingsPercentage: 20,
        icon: '🍔'
    }
]

/**
 * Get combo by ID
 */
export function getComboById(id: string): Combo | undefined {
    return COMBOS.find((combo) => combo.id === id)
}

/**
 * Get popular combos
 */
export function getPopularCombos(): Combo[] {
    return COMBOS.filter((combo) => combo.isPopular)
}

/**
 * Get deal of the day
 */
export function getDealOfTheDay(): Combo | undefined {
    return COMBOS.find((combo) => combo.isDealOfTheDay)
}

/**
 * Get combos by dietary tags
 */
export function getCombosByDietaryTag(tag: string): Combo[] {
    return COMBOS.filter((combo) => combo.dietaryTags?.includes(tag))
}

/**
 * Calculate savings if user applies a combo
 */
export function calculateComboSavings(ingredients: Ingredients): {
    bestCombo: Combo | null
    savings: number
} {
    let bestCombo: Combo | null = null
    let maxSavings = 0

    // Check if current ingredients match any combo exactly
    for (const combo of COMBOS) {
        const matches =
            ingredients.meat === combo.ingredients.meat &&
            ingredients.cheese === combo.ingredients.cheese &&
            ingredients.salad === combo.ingredients.salad &&
            ingredients.bacon === combo.ingredients.bacon

        if (matches && combo.savings > maxSavings) {
            bestCombo = combo
            maxSavings = combo.savings
        }
    }

    return {
        bestCombo,
        savings: maxSavings
    }
}
