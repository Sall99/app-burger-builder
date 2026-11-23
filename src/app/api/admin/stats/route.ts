import { NextResponse } from 'next/server'

import { requireAdmin } from '@/lib/admin'

import prisma from '../../../../../libs/prisma.db'

export const dynamic = 'force-dynamic'

export async function GET() {
    try {
        await requireAdmin()

        const now = new Date()
        const thirtyDaysAgo = new Date(now)
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

        const fourteenDaysAgo = new Date(now)
        fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 13)
        fourteenDaysAgo.setHours(0, 0, 0, 0)

        const [
            allOrders,
            totalUsers,
            recentUsers,
            activeCoupons,
            totalCoupons,
            loyaltyMembers,
            recentOrdersList,
            usersWithOrders
        ] = await Promise.all([
            prisma.order.findMany({
                select: {
                    id: true,
                    totalPrice: true,
                    status: true,
                    payment_status: true,
                    createdAt: true
                }
            }),
            prisma.user.count(),
            prisma.user.count({
                where: { createdAt: { gte: thirtyDaysAgo } }
            }),
            prisma.coupon.count({ where: { isActive: true } }),
            prisma.coupon.count(),
            prisma.loyalty.count(),
            prisma.order.findMany({
                include: {
                    user: { select: { name: true, email: true } },
                    shippingAdresse: true
                },
                orderBy: { createdAt: 'desc' },
                take: 6
            }),
            prisma.user.findMany({
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    loyalty: { select: { currentTier: true } },
                    Order: {
                        select: {
                            totalPrice: true,
                            payment_status: true
                        }
                    }
                }
            })
        ])

        const totalOrders = allOrders.length
        let totalRevenue = 0
        let unpaidRevenue = 0
        let paidOrders = 0
        let unpaidOrders = 0
        let recentOrdersCount = 0
        let recentRevenueSum = 0

        const statusBreakdown = {
            PENDING: 0,
            PROCESSING: 0,
            COMPLETED: 0,
            DELIVERED: 0,
            CANCELLED: 0
        }

        const dailyMap = new Map<string, { revenue: number; orders: number; label: string }>()
        for (let i = 0; i < 14; i++) {
            const d = new Date(fourteenDaysAgo)
            d.setDate(d.getDate() + i)
            const key = d.toISOString().slice(0, 10)
            const label = d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })
            dailyMap.set(key, { revenue: 0, orders: 0, label })
        }

        for (const ord of allOrders) {
            const st = ord.status as keyof typeof statusBreakdown
            if (statusBreakdown[st] !== undefined) {
                statusBreakdown[st] += 1
            }

            if (ord.payment_status) {
                paidOrders += 1
                totalRevenue += ord.totalPrice
            } else {
                unpaidOrders += 1
                if (ord.status !== 'CANCELLED') {
                    unpaidRevenue += ord.totalPrice
                }
            }

            const created = new Date(ord.createdAt)
            if (created >= thirtyDaysAgo) {
                recentOrdersCount += 1
                if (ord.payment_status) {
                    recentRevenueSum += ord.totalPrice
                }
            }

            const dayKey = created.toISOString().slice(0, 10)
            const bucket = dailyMap.get(dayKey)
            if (bucket) {
                bucket.orders += 1
                if (ord.payment_status) {
                    bucket.revenue = Number((bucket.revenue + ord.totalPrice).toFixed(2))
                }
            }
        }

        const pendingOrders = statusBreakdown.PENDING + statusBreakdown.PROCESSING
        const averageOrderValue = paidOrders > 0 ? totalRevenue / paidOrders : 0

        const ordersGrowth = totalOrders > 0 ? (recentOrdersCount / totalOrders) * 100 : 0
        const usersGrowth = totalUsers > 0 ? (recentUsers / totalUsers) * 100 : 0
        const revenueGrowth = totalRevenue > 0 ? (recentRevenueSum / totalRevenue) * 100 : 0

        const dailySeries = Array.from(dailyMap.entries()).map(([date, val]) => ({
            date,
            label: val.label,
            revenue: Number(val.revenue.toFixed(2)),
            orders: val.orders
        }))

        const topCustomers = usersWithOrders
            .map((u) => {
                const ordersCount = u.Order.length
                const totalSpent = u.Order.reduce((acc, o) => acc + (o.totalPrice || 0), 0)
                return {
                    id: u.id,
                    name: u.name,
                    email: u.email,
                    role: u.role,
                    ordersCount,
                    totalSpent: Number(totalSpent.toFixed(2)),
                    tier: u.loyalty?.currentTier || 'BRONZE'
                }
            })
            .filter((u) => u.ordersCount > 0)
            .sort((a, b) => b.totalSpent - a.totalSpent)
            .slice(0, 5)

        return NextResponse.json({
            totalOrders,
            totalRevenue: Number(totalRevenue.toFixed(2)),
            totalUsers,
            pendingOrders,
            revenueGrowth: Number(revenueGrowth.toFixed(1)),
            ordersGrowth: Number(ordersGrowth.toFixed(1)),
            usersGrowth: Number(usersGrowth.toFixed(1)),
            paidOrders,
            unpaidOrders,
            unpaidRevenue: Number(unpaidRevenue.toFixed(2)),
            averageOrderValue: Number(averageOrderValue.toFixed(2)),
            activeCoupons,
            totalCoupons,
            loyaltyMembers,
            statusBreakdown,
            dailySeries,
            recentOrders: recentOrdersList,
            topCustomers
        })
    } catch (error) {
        console.error('Error fetching admin stats:', error)
        return NextResponse.json({ error: 'Unauthorized or server error' }, { status: 401 })
    }
}
