import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import type { Combo } from '@/types/combos'

interface ComboState {
    selectedCombo: Combo | null
    isComboApplied: boolean
}

const initialState: ComboState = {
    selectedCombo: null,
    isComboApplied: false
}

const comboSlice = createSlice({
    name: 'combo',
    initialState,
    reducers: {
        applyCombo: (state, action: PayloadAction<Combo>) => {
            state.selectedCombo = action.payload
            state.isComboApplied = true
        },

        clearCombo: (state) => {
            state.selectedCombo = null
            state.isComboApplied = false
        }
    }
})

export const { applyCombo, clearCombo } = comboSlice.actions

export const comboReducer = comboSlice.reducer
