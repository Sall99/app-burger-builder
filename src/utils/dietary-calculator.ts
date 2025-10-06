import {
    type AllergenInfo,
    BUN_DIETARY_DATA,
    INGREDIENT_DIETARY_DATA,
    type IngredientDietary,
    type NutritionalInfo
} from '@/types/dietary'

export interface BurgerDietaryInfo {
    totalNutrition: NutritionalInfo
    allergens: AllergenInfo
    isVegetarian: boolean
    isVegan: boolean
    isGlutenFree: boolean
    ingredientCount: number
}

/**
 * Calculate total dietary information for a burger
 * @param ingredients - Object with ingredient counts (e.g., { meat: 2, cheese: 1, bacon: 1, salad: 1 })
 * @returns Complete dietary information including nutrition and allergens
 */
export function calculateBurgerDietaryInfo(ingredients: Record<string, number>): BurgerDietaryInfo {
    // Start with the bun (always included)
    const totalNutrition: NutritionalInfo = {
        calories: BUN_DIETARY_DATA.nutritional.calories,
        protein: BUN_DIETARY_DATA.nutritional.protein,
        carbs: BUN_DIETARY_DATA.nutritional.carbs,
        fat: BUN_DIETARY_DATA.nutritional.fat,
        fiber: BUN_DIETARY_DATA.nutritional.fiber,
        sodium: BUN_DIETARY_DATA.nutritional.sodium
    }

    // Start with bun allergens
    const allergens: AllergenInfo = { ...BUN_DIETARY_DATA.allergens }

    let isVegetarian = BUN_DIETARY_DATA.isVegetarian
    let isVegan = BUN_DIETARY_DATA.isVegan
    let isGlutenFree = BUN_DIETARY_DATA.isGlutenFree
    let ingredientCount = 0

    // Add each ingredient's nutrition and allergens
    for (const [type, count] of Object.entries(ingredients)) {
        if (count > 0 && INGREDIENT_DIETARY_DATA[type]) {
            const ingredient = INGREDIENT_DIETARY_DATA[type]
            ingredientCount += count

            // Add nutrition (multiply by count)
            totalNutrition.calories += ingredient.nutritional.calories * count
            totalNutrition.protein += ingredient.nutritional.protein * count
            totalNutrition.carbs += ingredient.nutritional.carbs * count
            totalNutrition.fat += ingredient.nutritional.fat * count
            totalNutrition.fiber += ingredient.nutritional.fiber * count
            totalNutrition.sodium += ingredient.nutritional.sodium * count

            // Combine allergens (OR logic - if any ingredient has it, burger has it)
            Object.keys(allergens).forEach((key) => {
                const allergenKey = key as keyof AllergenInfo
                if (ingredient.allergens[allergenKey]) {
                    allergens[allergenKey] = true
                }
            })

            // Update dietary tags (AND logic - all must be true)
            if (!ingredient.isVegetarian) isVegetarian = false
            if (!ingredient.isVegan) isVegan = false
            if (!ingredient.isGlutenFree) isGlutenFree = false
        }
    }

    return {
        totalNutrition: {
            calories: Math.round(totalNutrition.calories),
            protein: Math.round(totalNutrition.protein * 10) / 10,
            carbs: Math.round(totalNutrition.carbs * 10) / 10,
            fat: Math.round(totalNutrition.fat * 10) / 10,
            fiber: Math.round(totalNutrition.fiber * 10) / 10,
            sodium: Math.round(totalNutrition.sodium)
        },
        allergens,
        isVegetarian,
        isVegan,
        isGlutenFree,
        ingredientCount
    }
}

/**
 * Get list of allergens present in the burger
 */
export function getAllergenList(allergens: AllergenInfo): string[] {
    const list: string[] = []
    if (allergens.gluten) list.push('gluten')
    if (allergens.dairy) list.push('dairy')
    if (allergens.eggs) list.push('eggs')
    if (allergens.soy) list.push('soy')
    if (allergens.nuts) list.push('nuts')
    if (allergens.shellfish) list.push('shellfish')
    return list
}

/**
 * Get dietary tags for the burger
 */
export function getDietaryTags(info: BurgerDietaryInfo): string[] {
    const tags: string[] = []
    if (info.isVegan) tags.push('vegan')
    else if (info.isVegetarian) tags.push('vegetarian')
    if (info.isGlutenFree) tags.push('gluten-free')
    return tags
}
