import { NextRequest, NextResponse } from 'next/server'

import { requireAdmin } from '@/lib/admin'

import prisma from '../../../../../libs/prisma.db'

export const dynamic = 'force-dynamic'

const DEFAULT_COUPONS = [
    {
        code: 'WELCOME10',
        description: '10% de réduction sur votre commande dès $10 (max $5)',
        discountType: 'percentage',
        discountValue: 10,
        minOrderValue: 10,
        maxDiscount: 5,
        usageLimit: 500,
        isActive: true
    },
    {
        code: 'SAVE5',
        description: '$5 offerts dès $15 de commande',
        discountType: 'fixed',
        discountValue: 5,
        minOrderValue: 15,
        maxDiscount: null,
        usageLimit: 300,
        isActive: true
    },
    {
        code: 'BURGER20',
        description: '20% de remise sur les commandes gourmandes dès $20 (max $10)',
        discountType: 'percentage',
        discountValue: 20,
        minOrderValue: 20,
        maxDiscount: 10,
        usageLimit: 200,
        isActive: true
    }
]

export async function GET(request: NextRequest) {
    try {
        await requireAdmin()

        const searchParams = request.nextUrl.searchParams
        const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
        const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '10')))
        const search = (searchParams.get('search') || '').trim().toLowerCase()
        const status = searchParams.get('status') || undefined

        const allCoupons = await prisma.coupon.findMany({
            orderBy: { createdAt: 'desc' }
        })

        const now = new Date()
        const summary = {
            total: allCoupons.length,
            active: allCoupons.filter(
                (c) => c.isActive && (!c.validUntil || new Date(c.validUntil) >= now)
            ).length,
            inactive: allCoupons.filter((c) => !c.isActive).length,
            totalRedemptions: allCoupons.reduce((acc, c) => acc + (c.usageCount || 0), 0)
        }

        const filtered = allCoupons.filter((c) => {
            const isExpired = Boolean(c.validUntil && new Date(c.validUntil) < now)
            if (status === 'active' && (!c.isActive || isExpired)) return false
            if (status === 'inactive' && c.isActive) return false
            if (status === 'expired' && !isExpired) return false
            if (search) {
                const codeMatch = c.code.toLowerCase().includes(search)
                const descMatch = (c.description || '').toLowerCase().includes(search)
                if (!codeMatch && !descMatch) return false
            }
            return true
        })

        const total = filtered.length
        const skip = (page - 1) * limit
        const coupons = filtered.slice(skip, skip + limit)

        return NextResponse.json({
            coupons,
            summary,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.max(1, Math.ceil(total / limit))
            }
        })
    } catch (error) {
        console.error('Error fetching coupons:', error)
        return NextResponse.json({ error: 'Unauthorized or server error' }, { status: 401 })
    }
}

export async function POST(request: NextRequest) {
    try {
        await requireAdmin()

        const body = await request.json()

        // 1-click seed default store promo codes
        if (body?.action === 'seed_defaults') {
            const results = []
            for (const preset of DEFAULT_COUPONS) {
                const upserted = await prisma.coupon.upsert({
                    where: { code: preset.code },
                    create: preset,
                    update: {
                        description: preset.description,
                        discountType: preset.discountType,
                        discountValue: preset.discountValue,
                        minOrderValue: preset.minOrderValue,
                        maxDiscount: preset.maxDiscount,
                        isActive: true
                    }
                })
                results.push(upserted)
            }
            return NextResponse.json({ seeded: results.length, coupons: results })
        }

        const {
            code,
            description,
            discountType,
            discountValue,
            minOrderValue,
            maxDiscount,
            usageLimit,
            userLimit,
            validFrom,
            validUntil,
            isActive
        } = body

        if (!code || !discountType || discountValue === undefined || discountValue === '') {
            return NextResponse.json(
                { error: 'Code, discount type, and discount value are required' },
                { status: 400 }
            )
        }

        const coupon = await prisma.coupon.create({
            data: {
                code: String(code).trim().toUpperCase(),
                description: description ? String(description).trim() : null,
                discountType: discountType === 'fixed' ? 'fixed' : 'percentage',
                discountValue: parseFloat(String(discountValue)),
                minOrderValue:
                    minOrderValue !== null && minOrderValue !== undefined && minOrderValue !== ''
                        ? parseFloat(String(minOrderValue))
                        : null,
                maxDiscount:
                    maxDiscount !== null && maxDiscount !== undefined && maxDiscount !== ''
                        ? parseFloat(String(maxDiscount))
                        : null,
                usageLimit:
                    usageLimit !== null && usageLimit !== undefined && usageLimit !== ''
                        ? parseInt(String(usageLimit))
                        : null,
                userLimit:
                    userLimit !== null && userLimit !== undefined && userLimit !== ''
                        ? parseInt(String(userLimit))
                        : null,
                validFrom: validFrom ? new Date(validFrom) : new Date(),
                validUntil: validUntil ? new Date(validUntil) : null,
                isActive: isActive !== undefined ? Boolean(isActive) : true
            }
        })

        return NextResponse.json(coupon)
    } catch (error: any) {
        console.error('Error creating coupon:', error)
        if (error.code === 'P2002') {
            return NextResponse.json({ error: 'Coupon code already exists' }, { status: 400 })
        }
        return NextResponse.json({ error: 'Failed to create coupon' }, { status: 500 })
    }
}

export async function PATCH(request: NextRequest) {
    try {
        await requireAdmin()

        const body = await request.json()
        const { couponId } = body

        if (!couponId) {
            return NextResponse.json({ error: 'Coupon ID is required' }, { status: 400 })
        }

        const cleanData: Record<string, any> = {}

        if (typeof body.code === 'string' && body.code.trim()) {
            cleanData.code = body.code.trim().toUpperCase()
        }
        if (body.description !== undefined) {
            cleanData.description = body.description ? String(body.description).trim() : null
        }
        if (body.discountType === 'percentage' || body.discountType === 'fixed') {
            cleanData.discountType = body.discountType
        }
        if (body.discountValue !== undefined && body.discountValue !== '') {
            cleanData.discountValue = parseFloat(String(body.discountValue))
        }
        if ('minOrderValue' in body) {
            cleanData.minOrderValue =
                body.minOrderValue !== null && body.minOrderValue !== ''
                    ? parseFloat(String(body.minOrderValue))
                    : null
        }
        if ('maxDiscount' in body) {
            cleanData.maxDiscount =
                body.maxDiscount !== null && body.maxDiscount !== ''
                    ? parseFloat(String(body.maxDiscount))
                    : null
        }
        if ('usageLimit' in body) {
            cleanData.usageLimit =
                body.usageLimit !== null && body.usageLimit !== ''
                    ? parseInt(String(body.usageLimit))
                    : null
        }
        if ('userLimit' in body) {
            cleanData.userLimit =
                body.userLimit !== null && body.userLimit !== ''
                    ? parseInt(String(body.userLimit))
                    : null
        }
        if (body.validFrom) {
            cleanData.validFrom = new Date(body.validFrom)
        }
        if ('validUntil' in body) {
            cleanData.validUntil = body.validUntil ? new Date(body.validUntil) : null
        }
        if (typeof body.isActive === 'boolean') {
            cleanData.isActive = body.isActive
        }

        const updatedCoupon = await prisma.coupon.update({
            where: { id: couponId },
            data: cleanData
        })

        return NextResponse.json(updatedCoupon)
    } catch (error) {
        console.error('Error updating coupon:', error)
        return NextResponse.json({ error: 'Failed to update coupon' }, { status: 500 })
    }
}

export async function DELETE(request: NextRequest) {
    try {
        await requireAdmin()

        const searchParams = request.nextUrl.searchParams
        const couponId = searchParams.get('id')

        if (!couponId) {
            return NextResponse.json({ error: 'Coupon ID is required' }, { status: 400 })
        }

        await prisma.couponUsage.deleteMany({
            where: { couponId }
        })

        await prisma.coupon.delete({
            where: { id: couponId }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error deleting coupon:', error)
        return NextResponse.json({ error: 'Failed to delete coupon' }, { status: 500 })
    }
}
