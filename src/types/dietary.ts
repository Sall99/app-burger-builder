export interface NutritionalInfo {
    calories: number
    protein: number // grams
    carbs: number // grams
    fat: number // grams
    fiber: number // grams
    sodium: number // milligrams
}

export interface AllergenInfo {
    gluten: boolean
    dairy: boolean
    eggs: boolean
    soy: boolean
    nuts: boolean
    shellfish: boolean
}

export interface IngredientDietary {
    name: string
    nutritional: NutritionalInfo
    allergens: AllergenInfo
    isVegetarian: boolean
    isVegan: boolean
    isGlutenFree: boolean
}

export const INGREDIENT_DIETARY_DATA: Record<string, IngredientDietary> = {
    meat: {
        name: 'Beef Patty',
        nutritional: {
            calories: 250,
            protein: 18,
            carbs: 0,
            fat: 20,
            fiber: 0,
            sodium: 75
        },
        allergens: {
            gluten: false,
            dairy: false,
            eggs: false,
            soy: false,
            nuts: false,
            shellfish: false
        },
        isVegetarian: false,
        isVegan: false,
        isGlutenFree: true
    },
    cheese: {
        name: 'Cheddar Cheese',
        nutritional: {
            calories: 113,
            protein: 7,
            carbs: 1,
            fat: 9,
            fiber: 0,
            sodium: 176
        },
        allergens: {
            gluten: false,
            dairy: true,
            eggs: false,
            soy: false,
            nuts: false,
            shellfish: false
        },
        isVegetarian: true,
        isVegan: false,
        isGlutenFree: true
    },
    bacon: {
        name: 'Bacon',
        nutritional: {
            calories: 130,
            protein: 9,
            carbs: 0,
            fat: 10,
            fiber: 0,
            sodium: 400
        },
        allergens: {
            gluten: false,
            dairy: false,
            eggs: false,
            soy: false,
            nuts: false,
            shellfish: false
        },
        isVegetarian: false,
        isVegan: false,
        isGlutenFree: true
    },
    salad: {
        name: 'Lettuce',
        nutritional: {
            calories: 5,
            protein: 0.5,
            carbs: 1,
            fat: 0,
            fiber: 0.5,
            sodium: 10
        },
        allergens: {
            gluten: false,
            dairy: false,
            eggs: false,
            soy: false,
            nuts: false,
            shellfish: false
        },
        isVegetarian: true,
        isVegan: true,
        isGlutenFree: true
    }
}

// Base bun nutritional info
export const BUN_DIETARY_DATA: IngredientDietary = {
    name: 'Sesame Bun',
    nutritional: {
        calories: 240,
        protein: 8,
        carbs: 45,
        fat: 4,
        fiber: 2,
        sodium: 420
    },
    allergens: {
        gluten: true,
        dairy: true,
        eggs: true,
        soy: true,
        nuts: false,
        shellfish: false
    },
    isVegetarian: true,
    isVegan: false,
    isGlutenFree: false
}
