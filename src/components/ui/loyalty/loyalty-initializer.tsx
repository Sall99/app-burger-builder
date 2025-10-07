'use client'

import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { selectLoyalty } from '@/redux/selectors/loyalty'
import { setLoyaltyData } from '@/redux/slices/loyalty'

export const LoyaltyInitializer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const dispatch = useDispatch()
    const { isLoaded } = useSelector(selectLoyalty)

    useEffect(() => {
        if (!isLoaded) {
            dispatch(
                setLoyaltyData({
                    totalPoints: 750,
                    availablePoints: 650,
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
