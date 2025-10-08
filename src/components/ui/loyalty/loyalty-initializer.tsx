'use client'

import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import { useSession } from 'next-auth/react'

import { getUserLoyalty } from '@/actions/loyalty'
import { selectLoyalty } from '@/redux/selectors/loyalty'
import { setLoyaltyData } from '@/redux/slices/loyalty'

export const LoyaltyInitializer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const dispatch = useDispatch()
    const { data: session, status } = useSession()
    const { isLoaded } = useSelector(selectLoyalty)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        const fetchLoyaltyData = async () => {
            // Only fetch if user is authenticated and data isn't already loaded
            if (status === 'loading' || isLoaded || isLoading) return

            if (status === 'unauthenticated') {
                // Set default data for unauthenticated users
                dispatch(
                    setLoyaltyData({
                        totalPoints: 0,
                        availablePoints: 0,
                        currentTier: 'bronze',
                        lifetimeSpend: 0,
                        ordersCount: 0,
                        redeemedRewards: []
                    })
                )
                return
            }

            if (session?.user && !isLoaded) {
                setIsLoading(true)
                try {
                    const result = await getUserLoyalty()

                    if (result.success && result.data) {
                        dispatch(setLoyaltyData(result.data))
                    } else {
                        dispatch(
                            setLoyaltyData({
                                totalPoints: 0,
                                availablePoints: 0,
                                currentTier: 'bronze',
                                lifetimeSpend: 0,
                                ordersCount: 0,
                                redeemedRewards: []
                            })
                        )
                        if (result.error) {
                            console.error('Failed to load loyalty data:', result.error)
                        }
                    }
                } catch (error) {
                    console.error('Error fetching loyalty data:', error)
                    toast.error('Failed to load loyalty data')

                    dispatch(
                        setLoyaltyData({
                            totalPoints: 0,
                            availablePoints: 0,
                            currentTier: 'bronze',
                            lifetimeSpend: 0,
                            ordersCount: 0,
                            redeemedRewards: []
                        })
                    )
                } finally {
                    setIsLoading(false)
                }
            }
        }

        fetchLoyaltyData()
    }, [dispatch, isLoaded, session, status, isLoading])

    return <>{children}</>
}
