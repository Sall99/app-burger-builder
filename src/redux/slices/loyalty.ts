import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import type { LoyaltyTier, RedeemedReward } from '@/types/loyalty'

interface LoyaltyState {
    totalPoints: number
    availablePoints: number
    currentTier: LoyaltyTier
    lifetimeSpend: number
    ordersCount: number
    redeemedRewards: RedeemedReward[]
    isLoaded: boolean
}

const initialState: LoyaltyState = {
    totalPoints: 0,
    availablePoints: 0,
    currentTier: 'bronze',
    lifetimeSpend: 0,
    ordersCount: 0,
    redeemedRewards: [],
    isLoaded: false
}

const loyaltySlice = createSlice({
    name: 'loyalty',
    initialState,
    reducers: {
        setLoyaltyData: (
            state,
            action: PayloadAction<{
                totalPoints: number
                availablePoints: number
                currentTier: LoyaltyTier
                lifetimeSpend: number
                ordersCount: number
                redeemedRewards: RedeemedReward[]
            }>
        ) => {
            state.totalPoints = action.payload.totalPoints
            state.availablePoints = action.payload.availablePoints
            state.currentTier = action.payload.currentTier
            state.lifetimeSpend = action.payload.lifetimeSpend
            state.ordersCount = action.payload.ordersCount
            state.redeemedRewards = action.payload.redeemedRewards
            state.isLoaded = true
        },

        addPoints: (state, action: PayloadAction<number>) => {
            state.totalPoints += action.payload
            state.availablePoints += action.payload
        },

        redeemReward: (
            state,
            action: PayloadAction<{ rewardId: string; pointsCost: number; expiryDays?: number }>
        ) => {
            const { rewardId, pointsCost, expiryDays } = action.payload

            // Deduct points
            state.availablePoints -= pointsCost

            // Add to redeemed rewards
            const redeemedAt = new Date()
            const expiresAt = expiryDays
                ? new Date(redeemedAt.getTime() + expiryDays * 24 * 60 * 60 * 1000)
                : undefined

            state.redeemedRewards.push({
                rewardId,
                redeemedAt,
                expiresAt,
                isUsed: false
            })
        },

        useReward: (state, action: PayloadAction<string>) => {
            const reward = state.redeemedRewards.find(
                (r) => r.rewardId === action.payload && !r.isUsed
            )
            if (reward) {
                reward.isUsed = true
                reward.usedAt = new Date()
            }
        },

        updateTier: (state, action: PayloadAction<LoyaltyTier>) => {
            state.currentTier = action.payload
        },

        incrementOrders: (state) => {
            state.ordersCount += 1
        },

        addLifetimeSpend: (state, action: PayloadAction<number>) => {
            state.lifetimeSpend += action.payload
        },

        resetLoyalty: (state) => {
            Object.assign(state, initialState)
        }
    }
})

export const {
    setLoyaltyData,
    addPoints,
    redeemReward,
    useReward,
    updateTier,
    incrementOrders,
    addLifetimeSpend,
    resetLoyalty
} = loyaltySlice.actions

export const loyaltyReducer = loyaltySlice.reducer
