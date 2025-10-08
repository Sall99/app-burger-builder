import { NextRequest, NextResponse } from 'next/server';

import { requireAdmin } from '@/lib/admin';

import prisma from '../../../../../libs/prisma.db';

export async function GET(request: NextRequest) {
    try {
        await requireAdmin();

        const searchParams = request.nextUrl.searchParams;
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const status = searchParams.get('status') || undefined;
        const skip = (page - 1) * limit;

        const where = status ? { status } : {};

        const [orders, total] = await Promise.all([
            prisma.order.findMany({
                where: status
                    ? { status: { equals: status as any } }
                    : undefined,
                include: {
                    user: {
                        select: {
                            name: true,
                            email: true
                        }
                    },
                    shippingAdresse: true
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit
            }),
            prisma.order.count({
                where: status
                    ? { status: { equals: status as any } }
                    : undefined
            })
        ]);

        return NextResponse.json({
            orders,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Error fetching orders:', error);
        return NextResponse.json({ error: 'Unauthorized or server error' }, { status: 401 });
    }
}

export async function PATCH(request: NextRequest) {
    try {
        await requireAdmin();

        const body = await request.json();
        const { orderId, status, payment_status } = body;

        if (!orderId) {
            return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
        }

        const updateData: any = {};
        if (status) updateData.status = status;
        if (payment_status !== undefined) updateData.payment_status = payment_status;

        const updatedOrder = await prisma.order.update({
            where: { id: orderId },
            data: updateData,
            include: {
                user: {
                    select: {
                        name: true,
                        email: true
                    }
                },
                shippingAdresse: true
            }
        });

        return NextResponse.json(updatedOrder);
    } catch (error) {
        console.error('Error updating order:', error);
        return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
    }
}

