'use client'
import { RootState } from '../store'

export const selectLoyalty = (state: RootState) => state.rootReducer.loyalty
