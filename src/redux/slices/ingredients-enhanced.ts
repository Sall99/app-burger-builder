import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const ingredientNames = ['salad', 'bacon', 'cheese', 'meat']

type Prices = { [key: string]: number }

interface IngredientItem {
    id: string
    type: string
}

interface BurgerTemplate {
    id: string
    name: string
    ingredients: { [key: string]: number }
    ingredientOrder: IngredientItem[]
    totalPrice: number
    createdAt: number
}

interface IngredientsState {
    ingredients: { [key: string]: number }
    ingredientOrder: IngredientItem[]
    prices: Prices
    totalPrice: number
    history: Array<{
        ingredients: { [key: string]: number }
        ingredientOrder: IngredientItem[]
        totalPrice: number
    }>
    historyIndex: number
    savedTemplates: BurgerTemplate[]
    lastAction: 'add' | 'remove' | null
}

const initialState: IngredientsState = {
    ingredients: ingredientNames.reduce(
        (acc, ingredient) => {
            acc[ingredient] = 0
            return acc
        },
        {} as { [key: string]: number }
    ),
    ingredientOrder: [],
    prices: ingredientNames.reduce((acc, ingredient) => {
        acc[ingredient] = {
            salad: 0.5,
            bacon: 0.7,
            cheese: 0.4,
            meat: 1.3
        }[ingredient] as number
        return acc
    }, {} as Prices),
    totalPrice: 4,
    history: [],
    historyIndex: -1,
    savedTemplates: [],
    lastAction: null
}

const ingredientSlice = createSlice({
    name: 'ingredient',
    initialState,
    reducers: {
        addIngredients(state, action: PayloadAction<string>) {
            const { payload } = action

            if (state.historyIndex < state.history.length - 1) {
                state.history = state.history.slice(0, state.historyIndex + 1)
            }

            state.history.push({
                ingredients: { ...state.ingredients },
                ingredientOrder: [...state.ingredientOrder],
                totalPrice: state.totalPrice
            })
            state.historyIndex++

            if (state.history.length > 20) {
                state.history.shift()
                state.historyIndex--
            }

            state.ingredients[payload] += 1
            state.totalPrice = Number((state.totalPrice + state.prices[payload]).toFixed(2))

            state.ingredientOrder.push({
                id: `${payload}-${Date.now()}-${Math.random()}`,
                type: payload
            })

            state.lastAction = 'add'
        },
        removeIngredients(state, action: PayloadAction<string>) {
            const { payload } = action
            if (state.ingredients[payload] > 0) {
                if (state.historyIndex < state.history.length - 1) {
                    state.history = state.history.slice(0, state.historyIndex + 1)
                }

                state.history.push({
                    ingredients: { ...state.ingredients },
                    ingredientOrder: [...state.ingredientOrder],
                    totalPrice: state.totalPrice
                })
                state.historyIndex++

                if (state.history.length > 20) {
                    state.history.shift()
                    state.historyIndex--
                }

                state.ingredients[payload] -= 1
                state.totalPrice = Number((state.totalPrice - state.prices[payload]).toFixed(2))

                const index = state.ingredientOrder
                    .map((item, idx) => (item.type === payload ? idx : -1))
                    .filter((idx) => idx !== -1)
                    .pop()

                if (index !== undefined && index !== -1) {
                    state.ingredientOrder.splice(index, 1)
                }

                state.lastAction = 'remove'
            }
        },
        reorderIngredients(state, action: PayloadAction<{ fromIndex: number; toIndex: number }>) {
            const { fromIndex, toIndex } = action.payload
            const [removed] = state.ingredientOrder.splice(fromIndex, 1)
            state.ingredientOrder.splice(toIndex, 0, removed)
        },
        undo(state) {
            if (state.historyIndex > 0) {
                state.historyIndex--
                const previousState = state.history[state.historyIndex]
                state.ingredients = { ...previousState.ingredients }
                state.ingredientOrder = [...previousState.ingredientOrder]
                state.totalPrice = previousState.totalPrice
                state.lastAction = null
            }
        },
        redo(state) {
            if (state.historyIndex < state.history.length - 1) {
                state.historyIndex++
                const nextState = state.history[state.historyIndex]
                state.ingredients = { ...nextState.ingredients }
                state.ingredientOrder = [...nextState.ingredientOrder]
                state.totalPrice = nextState.totalPrice
                state.lastAction = null
            }
        },
        clearBurger(state) {
            if (state.ingredientOrder.length > 0) {
                state.history.push({
                    ingredients: { ...state.ingredients },
                    ingredientOrder: [...state.ingredientOrder],
                    totalPrice: state.totalPrice
                })
                state.historyIndex++
            }

            state.ingredients = ingredientNames.reduce(
                (acc, ingredient) => {
                    acc[ingredient] = 0
                    return acc
                },
                {} as { [key: string]: number }
            )
            state.ingredientOrder = []
            state.totalPrice = 4
            state.lastAction = null
        },
        saveTemplate(state, action: PayloadAction<string>) {
            const template: BurgerTemplate = {
                id: `template-${Date.now()}`,
                name: action.payload,
                ingredients: { ...state.ingredients },
                ingredientOrder: [...state.ingredientOrder],
                totalPrice: state.totalPrice,
                createdAt: Date.now()
            }
            state.savedTemplates.push(template)

            if (state.savedTemplates.length > 10) {
                state.savedTemplates.shift()
            }
        },
        loadTemplate(state, action: PayloadAction<string>) {
            const template = state.savedTemplates.find((t) => t.id === action.payload)
            if (template) {
                state.history.push({
                    ingredients: { ...state.ingredients },
                    ingredientOrder: [...state.ingredientOrder],
                    totalPrice: state.totalPrice
                })
                state.historyIndex++

                state.ingredients = { ...template.ingredients }
                state.ingredientOrder = [...template.ingredientOrder]
                state.totalPrice = template.totalPrice
                state.lastAction = null
            }
        },
        deleteTemplate(state, action: PayloadAction<string>) {
            state.savedTemplates = state.savedTemplates.filter((t) => t.id !== action.payload)
        },
        clearLastAction(state) {
            state.lastAction = null
        },
        setIngredients(state, action: PayloadAction<{ [key: string]: number }>) {
            state.history.push({
                ingredients: { ...state.ingredients },
                ingredientOrder: [...state.ingredientOrder],
                totalPrice: state.totalPrice
            })
            state.historyIndex++

            state.ingredients = { ...action.payload }

            state.ingredientOrder = []
            Object.entries(action.payload).forEach(([type, count]) => {
                for (let i = 0; i < count; i++) {
                    state.ingredientOrder.push({
                        id: `${type}-${Date.now()}-${Math.random()}`,
                        type
                    })
                }
            })

            state.totalPrice = Object.entries(action.payload).reduce(
                (total, [type, count]) => total + state.prices[type] * count,
                4
            )
            state.lastAction = null
        },
        clearIngredients(state) {
            if (state.ingredientOrder.length > 0) {
                state.history.push({
                    ingredients: { ...state.ingredients },
                    ingredientOrder: [...state.ingredientOrder],
                    totalPrice: state.totalPrice
                })
                state.historyIndex++
            }

            state.ingredients = ingredientNames.reduce(
                (acc, ingredient) => {
                    acc[ingredient] = 0
                    return acc
                },
                {} as { [key: string]: number }
            )
            state.ingredientOrder = []
            state.totalPrice = 4
            state.lastAction = null
        }
    }
})

export const ingredientsReducer = ingredientSlice.reducer
export const {
    addIngredients,
    removeIngredients,
    reorderIngredients,
    undo,
    redo,
    clearBurger,
    saveTemplate,
    loadTemplate,
    deleteTemplate,
    clearLastAction,
    setIngredients,
    clearIngredients
} = ingredientSlice.actions

export type { BurgerTemplate, IngredientsState }
