import { createSlice } from '@reduxjs/toolkit';

const ingredientNames = ['salad', 'bacon', 'cheese', 'meat'];

type Prices = { [key: string]: number }

const initialState = {
    ingredients: ingredientNames.reduce(
        (acc, ingredient) => {
            acc[ingredient] = 0;
            return acc;
        },
        {} as { [key: string]: number }
    ),
    prices: ingredientNames.reduce((acc, ingredient) => {
        acc[ingredient] = {
            salad: 0.5,
            bacon: 0.7,
            cheese: 0.4,
            meat: 1.3
        }[ingredient] as number;
        return acc;
    }, {} as Prices),
    totalPrice: 4
};

const ingredientSlice = createSlice({
    name: 'ingredient',
    initialState,
    reducers: {
        addIngredients(state, action) {
            const { payload } = action;
            state.ingredients[payload] += 1;
            state.totalPrice += state.prices[payload];
        },
        removeIngredients(state, action) {
            const { payload } = action;
            if (state.ingredients[payload] > 0) {
                state.ingredients[payload] -= 1;
                state.totalPrice -= state.prices[payload];
            }
        }
    }
});

export const ingredientsReducer = ingredientSlice.reducer;
export const { addIngredients, removeIngredients } = ingredientSlice.actions;
