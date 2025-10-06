import { addIngredients, ingredientsReducer, removeIngredients } from '../ingredients'

describe('ingredients slice', () => {
    const initialState = {
        ingredients: {
            salad: 0,
            bacon: 0,
            cheese: 0,
            meat: 0
        } as { [key: string]: number },
        prices: {
            salad: 0.5,
            bacon: 0.7,
            cheese: 0.4,
            meat: 1.3
        } as { [key: string]: number },
        totalPrice: 4
    }

    it('should return the initial state', () => {
        expect(ingredientsReducer(undefined, { type: 'unknown' })).toEqual(initialState)
    })

    describe('addIngredients', () => {
        it('should add a salad ingredient and update price', () => {
            const actual = ingredientsReducer(initialState, addIngredients('salad'))
            expect(actual.ingredients.salad).toBe(1)
            expect(actual.totalPrice).toBe(4.5)
        })

        it('should add a bacon ingredient and update price', () => {
            const actual = ingredientsReducer(initialState, addIngredients('bacon'))
            expect(actual.ingredients.bacon).toBe(1)
            expect(actual.totalPrice).toBe(4.7)
        })

        it('should add a cheese ingredient and update price', () => {
            const actual = ingredientsReducer(initialState, addIngredients('cheese'))
            expect(actual.ingredients.cheese).toBe(1)
            expect(actual.totalPrice).toBe(4.4)
        })

        it('should add a meat ingredient and update price', () => {
            const actual = ingredientsReducer(initialState, addIngredients('meat'))
            expect(actual.ingredients.meat).toBe(1)
            expect(actual.totalPrice).toBe(5.3)
        })

        it('should add multiple ingredients correctly', () => {
            let state = ingredientsReducer(initialState, addIngredients('meat'))
            state = ingredientsReducer(state, addIngredients('cheese'))
            state = ingredientsReducer(state, addIngredients('bacon'))

            expect(state.ingredients.meat).toBe(1)
            expect(state.ingredients.cheese).toBe(1)
            expect(state.ingredients.bacon).toBe(1)
            expect(state.totalPrice).toBe(6.4)
        })
    })

    describe('removeIngredients', () => {
        it('should remove a salad ingredient and update price', () => {
            const stateWithSalad = {
                ...initialState,
                ingredients: { ...initialState.ingredients, salad: 2 },
                totalPrice: 5
            }
            const actual = ingredientsReducer(stateWithSalad, removeIngredients('salad'))
            expect(actual.ingredients.salad).toBe(1)
            expect(actual.totalPrice).toBe(4.5)
        })

        it('should not allow negative ingredient count', () => {
            const actual = ingredientsReducer(initialState, removeIngredients('meat'))
            expect(actual.ingredients.meat).toBe(0)
            expect(actual.totalPrice).toBe(4)
        })

        it('should remove multiple ingredients correctly', () => {
            const startState = {
                ...initialState,
                ingredients: {
                    salad: 2,
                    bacon: 1,
                    cheese: 3,
                    meat: 1
                },
                totalPrice: 10
            }

            let state = ingredientsReducer(startState, removeIngredients('meat'))
            state = ingredientsReducer(state, removeIngredients('cheese'))

            expect(state.ingredients.meat).toBe(0)
            expect(state.ingredients.cheese).toBe(2)
            expect(state.totalPrice).toBeCloseTo(8.3, 1)
        })
    })

    describe('edge cases', () => {
        it('should handle adding and removing the same ingredient', () => {
            let state = ingredientsReducer(initialState, addIngredients('bacon'))
            state = ingredientsReducer(state, removeIngredients('bacon'))

            expect(state.ingredients.bacon).toBe(0)
            expect(state.totalPrice).toBe(4)
        })

        it('should maintain correct price with decimal calculations', () => {
            let state = initialState

            for (let i = 0; i < 3; i++) {
                state = ingredientsReducer(state, addIngredients('salad'))
            }
            for (let i = 0; i < 2; i++) {
                state = ingredientsReducer(state, addIngredients('bacon'))
            }

            expect(state.ingredients.salad).toBe(3)
            expect(state.ingredients.bacon).toBe(2)
            expect(state.totalPrice).toBeCloseTo(6.9, 2)
        })
    })
})
