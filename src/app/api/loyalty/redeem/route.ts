import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'

import { REWARDS } from '@/types/loyalty'

import { authOptions } from '../../../../../libs/authOptions'
import prisma from '../../../../../libs/prisma.db'

export const dynamic = 'force-dynamic'

/**
 * POST /api/loyalty/redeem
 * Redeem a loyalty reward (validated server-side against catalog)
 */
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { rewardId } = body

        if (!rewardId || typeof rewardId !== 'string') {
            return NextResponse.json({ error: 'Missing required rewardId' }, { status: 400 })
        }

        const catalogReward = REWARDS.find((r) => r.id === rewardId)
        if (!catalogReward) {
            return NextResponse.json({ error: 'Invalid reward' }, { status: 404 })
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            include: { loyalty: true }
        })

        if (!user || !user.loyalty) {
            return NextResponse.json({ error: 'User loyalty data not found' }, { status: 404 })
        }

        if (user.loyalty.availablePoints < catalogReward.pointsCost) {
            return NextResponse.json({ error: 'Insufficient points' }, { status: 400 })
        }

        const expiresAt = catalogReward.expiryDays
            ? new Date(Date.now() + catalogReward.expiryDays * 24 * 60 * 60 * 1000)
            : null

        const [redeemedReward, updatedLoyalty] = await prisma.$transaction([
            prisma.redeemedReward.create({
                data: {
                    userId: user.id,
                    rewardId: catalogReward.id,
                    rewardName: catalogReward.name,
                    pointsCost: catalogReward.pointsCost,
                    expiresAt,
                    isUsed: false
                }
            }),
            prisma.loyalty.update({
                where: { userId: user.id },
                data: {
                    availablePoints: { decrement: catalogReward.pointsCost }
                }
            })
        ])

        return NextResponse.json({
            success: true,
            reward: redeemedReward,
            availablePoints: updatedLoyalty.availablePoints
        })
    } catch (error) {
        console.error('Error redeeming reward:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
