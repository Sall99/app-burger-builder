/**
 * Ingredient Substitution System
 * Defines available substitutions and their properties
 */

export interface Substitution {
    id: string
    name: string
    description: string
    originalIngredient: string
    substituteIngredient: string
    priceAdjustment: number // Can be positive (upcharge) or negative (discount)
    isDietary: boolean // Is this for dietary reasons? (vegan, gluten-free, etc)
    dietaryType?: 'vegan' | 'vegetarian' | 'gluten-free' | 'dairy-free'
    icon?: string
}

export interface AppliedSubstitution {
    substitutionId: string
    originalIngredient: string
    substituteIngredient: string
    priceAdjustment: number
}

/**
 * Available Substitutions
 * Organized by ingredient type
 */
export const SUBSTITUTIONS: Record<string, Substitution[]> = {
    meat: [
        {
            id: 'meat-to-veggie',
            name: 'Veggie Patty',
            description: 'Plant-based patty (vegan)',
            originalIngredient: 'meat',
            substituteIngredient: 'veggie-patty',
            priceAdjustment: 0.5,
            isDietary: true,
            dietaryType: 'vegan',
            icon: '🌱'
        },
        {
            id: 'meat-to-turkey',
            name: 'Turkey Patty',
            description: 'Lean turkey patty',
            originalIngredient: 'meat',
            substituteIngredient: 'turkey-patty',
            priceAdjustment: 0.25,
            isDietary: false
        },
        {
            id: 'meat-to-chicken',
            name: 'Grilled Chicken',
            description: 'Grilled chicken breast',
            originalIngredient: 'meat',
            substituteIngredient: 'chicken',
            priceAdjustment: 0,
            isDietary: false
        }
    ],
    cheese: [
        {
            id: 'cheese-to-vegan',
            name: 'Vegan Cheese',
            description: 'Dairy-free cheese (vegan)',
            originalIngredient: 'cheese',
            substituteIngredient: 'vegan-cheese',
            priceAdjustment: 0.75,
            isDietary: true,
            dietaryType: 'vegan',
            icon: '🌱'
        },
        {
            id: 'cheese-to-swiss',
            name: 'Swiss Cheese',
            description: 'Premium Swiss cheese',
            originalIngredient: 'cheese',
            substituteIngredient: 'swiss-cheese',
            priceAdjustment: 0.5,
            isDietary: false
        },
        {
            id: 'cheese-no-cheese',
            name: 'No Cheese',
            description: 'Remove cheese',
            originalIngredient: 'cheese',
            substituteIngredient: 'none',
            priceAdjustment: -0.5,
            isDietary: true,
            dietaryType: 'dairy-free'
        }
    ],
    bacon: [
        {
            id: 'bacon-to-turkey',
            name: 'Turkey Bacon',
            description: 'Leaner turkey bacon',
            originalIngredient: 'bacon',
            substituteIngredient: 'turkey-bacon',
            priceAdjustment: 0.25,
            isDietary: false
        },
        {
            id: 'bacon-to-veggie',
            name: 'Veggie Bacon',
            description: 'Plant-based bacon (vegan)',
            originalIngredient: 'bacon',
            substituteIngredient: 'veggie-bacon',
            priceAdjustment: 0.5,
            isDietary: true,
            dietaryType: 'vegan',
            icon: '🌱'
        }
    ],
    salad: [
        {
            id: 'salad-to-spinach',
            name: 'Baby Spinach',
            description: 'Fresh baby spinach',
            originalIngredient: 'salad',
            substituteIngredient: 'spinach',
            priceAdjustment: 0.25,
            isDietary: false
        },
        {
            id: 'salad-to-arugula',
            name: 'Arugula',
            description: 'Peppery arugula',
            originalIngredient: 'salad',
            substituteIngredient: 'arugula',
            priceAdjustment: 0.5,
            isDietary: false
        }
    ]
}

/**
 * Get all substitutions for a specific ingredient
 */
export function getSubstitutionsForIngredient(ingredient: string): Substitution[] {
    return SUBSTITUTIONS[ingredient] || []
}

/**
 * Get a specific substitution by ID
 */
export function getSubstitutionById(id: string): Substitution | undefined {
    for (const subs of Object.values(SUBSTITUTIONS)) {
        const found = subs.find((s) => s.id === id)
        if (found) return found
    }
    return undefined
}

/**
 * Calculate total price adjustment from all substitutions
 */
export function calculateSubstitutionCost(substitutions: AppliedSubstitution[]): number {
    return substitutions.reduce((total, sub) => total + sub.priceAdjustment, 0)
}

/**
 * Get dietary-friendly substitutions
 */
export function getDietarySubstitutions(
    dietaryType: 'vegan' | 'vegetarian' | 'gluten-free' | 'dairy-free'
): Substitution[] {
    const allSubs: Substitution[] = []

    for (const subs of Object.values(SUBSTITUTIONS)) {
        allSubs.push(...subs.filter((s) => s.isDietary && s.dietaryType === dietaryType))
    }

    return allSubs
}

/**
 * Display name for substituted ingredient
 */
export function getSubstitutedIngredientName(substitutionId: string): string {
    const sub = getSubstitutionById(substitutionId)
    return sub ? sub.name : ''
}
