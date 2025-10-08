import { NextResponse } from 'next/server';

import { requireAdmin } from '@/lib/admin';

import prisma from '../../../../../libs/prisma.db';

export async function GET() {
    try {
        await requireAdmin();

        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const [totalOrders, totalUsers, totalRevenue, pendingOrders] = await Promise.all([
            prisma.order.count(),
            prisma.user.count(),
            prisma.order.aggregate({
                where: { payment_status: true },
                _sum: { totalPrice: true }
            }),
            prisma.order.count({
                where: {
                    status: { in: ['PENDING', 'PROCESSING'] }
                }
            })
        ]);

        const [recentOrders, recentUsers, recentRevenue] = await Promise.all([
            prisma.order.count({
                where: {
                    createdAt: { gte: thirtyDaysAgo }
                }
            }),
            prisma.user.count({
                where: {
                    createdAt: { gte: thirtyDaysAgo }
                }
            }),
            prisma.order.aggregate({
                where: {
                    payment_status: true,
                    createdAt: { gte: thirtyDaysAgo }
                },
                _sum: { totalPrice: true }
            })
        ]);

        const ordersGrowth = totalOrders > 0 ? (recentOrders / totalOrders) * 100 : 0;
        const usersGrowth = totalUsers > 0 ? (recentUsers / totalUsers) * 100 : 0;
        const revenueGrowth =
            totalRevenue._sum.totalPrice && totalRevenue._sum.totalPrice > 0
                ? ((recentRevenue._sum.totalPrice || 0) / totalRevenue._sum.totalPrice) * 100
                : 0;

        return NextResponse.json({
            totalOrders,
            totalRevenue: totalRevenue._sum.totalPrice || 0,
            totalUsers,
            pendingOrders,
            revenueGrowth: Number(revenueGrowth.toFixed(2)),
            ordersGrowth: Number(ordersGrowth.toFixed(2)),
            usersGrowth: Number(usersGrowth.toFixed(2))
        });
    } catch (error) {
        console.error('Error fetching admin stats:', error);
        return NextResponse.json({ error: 'Unauthorized or server error' }, { status: 401 });
    }
}

