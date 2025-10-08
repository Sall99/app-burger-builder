'use server'

import { getServerSession } from 'next-auth'

import { calculatePointsEarned, getTierFromPoints, type LoyaltyTier } from '@/types/loyalty'

import { authOptions } from '../../../libs/authOptions'
import prisma from '../../../libs/prisma.db'

interface RedeemedRewardData {
    rewardId: string
    rewardName: string
    pointsCost: number
    expiryDays?: number
}

/**
 * Get user loyalty data
 */
export async function getUserLoyalty() {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.email) {
            return {
                success: false,
                error: 'Unauthorized'
            }
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            include: {
                loyalty: true,
                redeemedRewards: {
                    orderBy: { redeemedAt: 'desc' }
                }
            }
        })

        if (!user) {
            return {
                success: false,
                error: 'User not found'
            }
        }

        if (!user.loyalty) {
            const newLoyalty = await prisma.loyalty.create({
                data: {
                    userId: user.id,
                    totalPoints: 0,
                    availablePoints: 0,
                    currentTier: 'BRONZE',
                    lifetimeSpend: 0,
                    ordersCount: 0
                }
            })

            return {
                success: true,
                data: {
                    totalPoints: newLoyalty.totalPoints,
                    availablePoints: newLoyalty.availablePoints,
                    currentTier: newLoyalty.currentTier.toLowerCase() as LoyaltyTier,
                    lifetimeSpend: newLoyalty.lifetimeSpend,
                    ordersCount: newLoyalty.ordersCount,
                    redeemedRewards: []
                }
            }
        }

        // Transform redeemed rewards to match the type structure
        const redeemedRewards = user.redeemedRewards.map((reward) => ({
            rewardId: reward.rewardId,
            redeemedAt: reward.redeemedAt,
            expiresAt: reward.expiresAt || undefined,
            isUsed: reward.isUsed,
            usedAt: reward.usedAt || undefined
        }))

        return {
            success: true,
            data: {
                totalPoints: user.loyalty.totalPoints,
                availablePoints: user.loyalty.availablePoints,
                currentTier: user.loyalty.currentTier.toLowerCase() as LoyaltyTier,
                lifetimeSpend: user.loyalty.lifetimeSpend,
                ordersCount: user.loyalty.ordersCount,
                redeemedRewards
            }
        }
    } catch (error) {
        console.error('Error fetching user loyalty:', error)
        return {
            success: false,
            error: 'Failed to fetch loyalty data'
        }
    }
}

/**
 * Add points to user loyalty after order completion
 */
export async function addLoyaltyPoints(orderTotal: number, orderId?: string) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.email) {
            return {
                success: false,
                error: 'Unauthorized'
            }
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            include: { loyalty: true }
        })

        if (!user) {
            return {
                success: false,
                error: 'User not found'
            }
        }

        if (!user.loyalty) {
            const newLoyalty = await prisma.loyalty.create({
                data: {
                    userId: user.id,
                    totalPoints: 0,
                    availablePoints: 0,
                    currentTier: 'BRONZE',
                    lifetimeSpend: 0,
                    ordersCount: 0
                }
            })

            user.loyalty = newLoyalty
        }

        const currentTier = user.loyalty.currentTier.toLowerCase() as LoyaltyTier
        const pointsEarned = calculatePointsEarned(orderTotal, currentTier)

        const newTotalPoints = user.loyalty.totalPoints + pointsEarned
        const newAvailablePoints = user.loyalty.availablePoints + pointsEarned
        const newLifetimeSpend = user.loyalty.lifetimeSpend + orderTotal
        const newOrdersCount = user.loyalty.ordersCount + 1

        const newTier = getTierFromPoints(newTotalPoints).toUpperCase() as
            | 'BRONZE'
            | 'SILVER'
            | 'GOLD'
            | 'PLATINUM'

        const updatedLoyalty = await prisma.loyalty.update({
            where: { userId: user.id },
            data: {
                totalPoints: newTotalPoints,
                availablePoints: newAvailablePoints,
                currentTier: newTier,
                lifetimeSpend: newLifetimeSpend,
                ordersCount: newOrdersCount
            }
        })

        return {
            success: true,
            data: {
                pointsEarned,
                totalPoints: updatedLoyalty.totalPoints,
                availablePoints: updatedLoyalty.availablePoints,
                currentTier: updatedLoyalty.currentTier.toLowerCase() as LoyaltyTier,
                tierUpgraded: newTier !== user.loyalty.currentTier
            }
        }
    } catch (error) {
        console.error('Error adding loyalty points:', error)
        return {
            success: false,
            error: 'Failed to add points'
        }
    }
}

/**
 * Redeem a reward
 */
export async function redeemLoyaltyReward(rewardData: RedeemedRewardData) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.email) {
            return {
                success: false,
                error: 'Unauthorized'
            }
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            include: { loyalty: true }
        })

        if (!user || !user.loyalty) {
            return {
                success: false,
                error: 'User loyalty data not found'
            }
        }

        if (user.loyalty.availablePoints < rewardData.pointsCost) {
            return {
                success: false,
                error: 'Insufficient points'
            }
        }

        const expiresAt = rewardData.expiryDays
            ? new Date(Date.now() + rewardData.expiryDays * 24 * 60 * 60 * 1000)
            : null

        const [redeemedReward, updatedLoyalty] = await prisma.$transaction([
            prisma.redeemedReward.create({
                data: {
                    userId: user.id,
                    rewardId: rewardData.rewardId,
                    rewardName: rewardData.rewardName,
                    pointsCost: rewardData.pointsCost,
                    expiresAt,
                    isUsed: false
                }
            }),
            prisma.loyalty.update({
                where: { userId: user.id },
                data: {
                    availablePoints: user.loyalty.availablePoints - rewardData.pointsCost
                }
            })
        ])

        return {
            success: true,
            data: {
                reward: redeemedReward,
                availablePoints: updatedLoyalty.availablePoints
            }
        }
    } catch (error) {
        console.error('Error redeeming reward:', error)
        return {
            success: false,
            error: 'Failed to redeem reward'
        }
    }
}

/**
 * Mark a redeemed reward as used
 */
export async function useRedeemedReward(rewardId: string) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.email) {
            return {
                success: false,
                error: 'Unauthorized'
            }
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        })

        if (!user) {
            return {
                success: false,
                error: 'User not found'
            }
        }

        const redeemedReward = await prisma.redeemedReward.findFirst({
            where: {
                id: rewardId,
                userId: user.id,
                isUsed: false
            }
        })

        if (!redeemedReward) {
            return {
                success: false,
                error: 'Reward not found or already used'
            }
        }

        const updatedReward = await prisma.redeemedReward.update({
            where: { id: rewardId },
            data: {
                isUsed: true,
                usedAt: new Date()
            }
        })

        return {
            success: true,
            data: updatedReward
        }
    } catch (error) {
        console.error('Error using redeemed reward:', error)
        return {
            success: false,
            error: 'Failed to mark reward as used'
        }
    }
}

/**
 * Get user's redeemed rewards
 */
export async function getUserRedeemedRewards() {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.email) {
            return {
                success: false,
                error: 'Unauthorized'
            }
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            include: {
                redeemedRewards: {
                    orderBy: { redeemedAt: 'desc' }
                }
            }
        })

        if (!user) {
            return {
                success: false,
                error: 'User not found'
            }
        }

        return {
            success: true,
            data: user.redeemedRewards
        }
    } catch (error) {
        console.error('Error fetching redeemed rewards:', error)
        return {
            success: false,
            error: 'Failed to fetch redeemed rewards'
        }
    }
}
