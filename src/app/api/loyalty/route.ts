import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'

import { authOptions } from '../../../../libs/authOptions'
import prisma from '../../../../libs/prisma.db'

/**
 * GET /api/loyalty
 * Get user's loyalty data
 */
export async function GET() {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
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
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
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

            return NextResponse.json({
                loyalty: newLoyalty,
                redeemedRewards: []
            })
        }

        return NextResponse.json({
            loyalty: user.loyalty,
            redeemedRewards: user.redeemedRewards
        })
    } catch (error) {
        console.error('Error fetching loyalty data:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
