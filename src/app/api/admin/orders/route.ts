import { NextRequest, NextResponse } from 'next/server'

import { requireAdmin } from '@/lib/admin'

import prisma from '../../../../../libs/prisma.db'

export const dynamic = 'force-dynamic'

const VALID_STATUSES = ['PENDING', 'PROCESSING', 'COMPLETED', 'DELIVERED', 'CANCELLED'] as const

export async function GET(request: NextRequest) {
    try {
        await requireAdmin()

        const searchParams = request.nextUrl.searchParams
        const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
        const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '10')))
        const status = searchParams.get('status') || undefined
        const payment = searchParams.get('payment') || undefined
        const search = (searchParams.get('search') || '').trim().toLowerCase()
        const sort = searchParams.get('sort') || 'newest'

        const allMatching = await prisma.order.findMany({
            include: {
                user: {
                    select: {
                        name: true,
                        email: true
                    }
                },
                shippingAdresse: true
            },
            orderBy:
                sort === 'oldest'
                    ? { createdAt: 'asc' }
                    : sort === 'highest'
                      ? { totalPrice: 'desc' }
                      : sort === 'lowest'
                        ? { totalPrice: 'asc' }
                        : { createdAt: 'desc' }
        })

        const summary = {
            ALL: allMatching.length,
            PENDING: 0,
            PROCESSING: 0,
            COMPLETED: 0,
            DELIVERED: 0,
            CANCELLED: 0,
            PAID: 0,
            UNPAID: 0
        }

        for (const o of allMatching) {
            const st = o.status as keyof typeof summary
            if (summary[st] !== undefined) summary[st] += 1
            if (o.payment_status) summary.PAID += 1
            else summary.UNPAID += 1
        }

        const filtered = allMatching.filter((o) => {
            if (status && o.status !== status) return false
            if (payment === 'paid' && !o.payment_status) return false
            if (payment === 'unpaid' && o.payment_status) return false
            if (search) {
                const idMatch = o.id.toLowerCase().includes(search)
                const nameMatch = (o.user?.name || '').toLowerCase().includes(search)
                const emailMatch = (o.user?.email || '').toLowerCase().includes(search)
                const townMatch = (o.shippingAdresse?.town || '').toLowerCase().includes(search)
                const streetMatch = (o.shippingAdresse?.streetAddress || '')
                    .toLowerCase()
                    .includes(search)
                if (!idMatch && !nameMatch && !emailMatch && !townMatch && !streetMatch) {
                    return false
                }
            }
            return true
        })

        const total = filtered.length
        const skip = (page - 1) * limit
        const orders = filtered.slice(skip, skip + limit)

        return NextResponse.json({
            orders,
            summary,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.max(1, Math.ceil(total / limit))
            }
        })
    } catch (error) {
        console.error('Error fetching orders:', error)
        return NextResponse.json({ error: 'Unauthorized or server error' }, { status: 401 })
    }
}

export async function PATCH(request: NextRequest) {
    try {
        await requireAdmin()

        const body = await request.json()
        const { orderId, orderIds, status, payment_status } = body

        const updateData: Record<string, any> = {}
        if (status && VALID_STATUSES.includes(status)) {
            updateData.status = status
        }
        if (typeof payment_status === 'boolean') {
            updateData.payment_status = payment_status
        }

        if (Object.keys(updateData).length === 0) {
            return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 })
        }

        // Bulk update support
        if (Array.isArray(orderIds) && orderIds.length > 0) {
            const result = await prisma.order.updateMany({
                where: { id: { in: orderIds } },
                data: updateData
            })
            return NextResponse.json({ updatedCount: result.count })
        }

        if (!orderId) {
            return NextResponse.json({ error: 'Order ID is required' }, { status: 400 })
        }

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
        })

        return NextResponse.json(updatedOrder)
    } catch (error) {
        console.error('Error updating order:', error)
        return NextResponse.json({ error: 'Failed to update order' }, { status: 500 })
    }
}

export async function DELETE(request: NextRequest) {
    try {
        await requireAdmin()

        const searchParams = request.nextUrl.searchParams
        const orderId = searchParams.get('id')

        if (!orderId) {
            return NextResponse.json({ error: 'Order ID is required' }, { status: 400 })
        }

        await prisma.order.delete({
            where: { id: orderId }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error deleting order:', error)
        return NextResponse.json({ error: 'Failed to delete order' }, { status: 500 })
    }
}
