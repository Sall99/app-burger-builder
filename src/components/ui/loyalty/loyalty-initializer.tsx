'use client'

import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { selectLoyalty } from '@/redux/selectors/loyalty'
import { setLoyaltyData } from '@/redux/slices/loyalty'

/**
 * Initializes demo loyalty data for the user
 * In production, this would fetch from an API
 */
export const LoyaltyInitializer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const dispatch = useDispatch()
    const { isLoaded } = useSelector(selectLoyalty)

    useEffect(() => {
        if (!isLoaded) {
            // Demo data - in production, fetch from API
            dispatch(
                setLoyaltyData({
                    totalPoints: 750, // Silver tier
                    availablePoints: 650, // Some points redeemed
                    currentTier: 'silver',
                    lifetimeSpend: 234.5,
                    ordersCount: 18,
                    redeemedRewards: []
                })
            )
        }
    }, [dispatch, isLoaded])

    return <>{children}</>
}
