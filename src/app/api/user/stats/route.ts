import { NextRequest, NextResponse } from 'next/server'

import { prisma } from '../../../../../libs/prisma.db'
import { getUserAndSession } from '../../../../../libs/session'

export async function GET(req: NextRequest) {
    try {
        const { user } = await getUserAndSession()

        if (!user || !user.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const userData = await prisma.user.findUnique({
            where: { id: user.id },
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
                emailVerified: true
            }
        })

        if (!userData) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        const orders = await prisma.order.findMany({
            where: { userId: user.id },
            select: {
                totalPrice: true,
                payment_status: true,
                status: true,
                createdAt: true
            }
        })

        const totalOrders = orders.length
        const totalSpent = orders.reduce((sum, order) => sum + order.totalPrice, 0)
        const paidOrders = orders.filter((order) => order.payment_status).length
        const pendingOrders = orders.filter((order) => !order.payment_status).length

        const recentOrders = await prisma.order.findMany({
            where: { userId: user.id },
            take: 5,
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                totalPrice: true,
                status: true,
                payment_status: true,
                createdAt: true
            }
        })

        return NextResponse.json(
            {
                user: {
                    id: userData.id,
                    name: userData.name,
                    email: userData.email,
                    memberSince: userData.createdAt,
                    emailVerified: userData.emailVerified
                },
                stats: {
                    totalOrders,
                    totalSpent,
                    paidOrders,
                    pendingOrders
                },
                recentOrders
            },
            { status: 200 }
        )
    } catch (error) {
        console.error('Error fetching user stats:', error)
        if (error instanceof Error && error.message === 'Unauthorized') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
