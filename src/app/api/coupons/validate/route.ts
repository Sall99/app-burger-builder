import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'

import { authOptions } from '../../../../../libs'

interface MockCoupon {
    code: string
    discountType: 'percentage' | 'fixed'
    discountValue: number
    maxDiscount: number | null
    minOrderValue: number | null
    isActive: boolean
    validUntil: Date | null
}

const MOCK_COUPONS: MockCoupon[] = [
    {
        code: 'WELCOME10',
        discountType: 'percentage',
        discountValue: 10,
        maxDiscount: 5,
        minOrderValue: 10,
        isActive: true,
        validUntil: null
    },
    {
        code: 'SAVE5',
        discountType: 'fixed',
        discountValue: 5,
        maxDiscount: null,
        minOrderValue: 15,
        isActive: true,
        validUntil: null
    },
    {
        code: 'BURGER20',
        discountType: 'percentage',
        discountValue: 20,
        maxDiscount: 10,
        minOrderValue: 20,
        isActive: true,
        validUntil: null
    }
]

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { code, orderTotal } = await request.json()

        if (!code || typeof code !== 'string') {
            return NextResponse.json({ error: 'Invalid coupon code' }, { status: 400 })
        }

        const coupon = MOCK_COUPONS.find((c) => c.code === code.toUpperCase() && c.isActive)

        if (!coupon) {
            return NextResponse.json({ error: 'Invalid or expired coupon code' }, { status: 404 })
        }

        if (coupon.validUntil && new Date() > coupon.validUntil) {
            return NextResponse.json({ error: 'This coupon has expired' }, { status: 400 })
        }

        if (coupon.minOrderValue && orderTotal < coupon.minOrderValue) {
            return NextResponse.json(
                {
                    error: `Minimum order value of $${coupon.minOrderValue} required`
                },
                { status: 400 }
            )
        }

        return NextResponse.json({
            valid: true,
            discountType: coupon.discountType,
            discountValue: coupon.discountValue,
            maxDiscount: coupon.maxDiscount,
            code: coupon.code
        })
    } catch (error) {
        console.error('Coupon validation error:', error)
        return NextResponse.json({ error: 'Failed to validate coupon' }, { status: 500 })
    }
}
