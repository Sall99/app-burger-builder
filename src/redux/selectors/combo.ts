'use client'
import { RootState } from '../store'

export const selectCombo = (state: RootState) => state.rootReducer.combo
