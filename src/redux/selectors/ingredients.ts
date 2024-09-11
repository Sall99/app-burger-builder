'use client';
import { RootState } from '../store';

const selectIngredients = (state: RootState) => state.rootReducer.ingredients;

export { selectIngredients };
