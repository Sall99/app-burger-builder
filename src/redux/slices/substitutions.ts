import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import type { AppliedSubstitution } from '@/types/substitutions'

interface SubstitutionsState {
    appliedSubstitutions: AppliedSubstitution[]
    totalAdjustment: number
}

const initialState: SubstitutionsState = {
    appliedSubstitutions: [],
    totalAdjustment: 0
}

const substitutionsSlice = createSlice({
    name: 'substitutions',
    initialState,
    reducers: {
        applySubstitution: (state, action: PayloadAction<AppliedSubstitution>) => {
            // Remove any existing substitution for this ingredient
            state.appliedSubstitutions = state.appliedSubstitutions.filter(
                (sub) => sub.originalIngredient !== action.payload.originalIngredient
            )

            // Add new substitution
            state.appliedSubstitutions.push(action.payload)

            // Recalculate total adjustment
            state.totalAdjustment = state.appliedSubstitutions.reduce(
                (total, sub) => total + sub.priceAdjustment,
                0
            )
        },

        removeSubstitution: (state, action: PayloadAction<string>) => {
            // Remove substitution by original ingredient
            state.appliedSubstitutions = state.appliedSubstitutions.filter(
                (sub) => sub.originalIngredient !== action.payload
            )

            // Recalculate total adjustment
            state.totalAdjustment = state.appliedSubstitutions.reduce(
                (total, sub) => total + sub.priceAdjustment,
                0
            )
        },

        clearSubstitutions: (state) => {
            state.appliedSubstitutions = []
            state.totalAdjustment = 0
        }
    }
})

export const { applySubstitution, removeSubstitution, clearSubstitutions } =
    substitutionsSlice.actions

export const substitutionsReducer = substitutionsSlice.reducer
