'use client'
import { RootState } from '../store'

export const selectSubstitutions = (state: RootState) => state.rootReducer.substitutions
