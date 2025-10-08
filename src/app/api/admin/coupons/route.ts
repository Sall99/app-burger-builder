import { NextRequest, NextResponse } from 'next/server';

import { requireAdmin } from '@/lib/admin';

import prisma from '../../../../../libs/prisma.db';

export async function GET(request: NextRequest) {
    try {
        await requireAdmin();

        const searchParams = request.nextUrl.searchParams;
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const skip = (page - 1) * limit;

        const [coupons, total] = await Promise.all([
            prisma.coupon.findMany({
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit
            }),
            prisma.coupon.count()
        ]);

        return NextResponse.json({
            coupons,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Error fetching coupons:', error);
        return NextResponse.json({ error: 'Unauthorized or server error' }, { status: 401 });
    }
}

export async function POST(request: NextRequest) {
    try {
        await requireAdmin();

        const body = await request.json();
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
        } = body;

        if (!code || !discountType || !discountValue) {
            return NextResponse.json(
                { error: 'Code, discount type, and discount value are required' },
                { status: 400 }
            );
        }

        const coupon = await prisma.coupon.create({
            data: {
                code: code.toUpperCase(),
                description,
                discountType,
                discountValue: parseFloat(discountValue),
                minOrderValue: minOrderValue ? parseFloat(minOrderValue) : null,
                maxDiscount: maxDiscount ? parseFloat(maxDiscount) : null,
                usageLimit: usageLimit ? parseInt(usageLimit) : null,
                userLimit: userLimit ? parseInt(userLimit) : null,
                validFrom: validFrom ? new Date(validFrom) : new Date(),
                validUntil: validUntil ? new Date(validUntil) : null,
                isActive: isActive !== undefined ? isActive : true
            }
        });

        return NextResponse.json(coupon);
    } catch (error: any) {
        console.error('Error creating coupon:', error);
        if (error.code === 'P2002') {
            return NextResponse.json({ error: 'Coupon code already exists' }, { status: 400 });
        }
        return NextResponse.json({ error: 'Failed to create coupon' }, { status: 500 });
    }
}

export async function PATCH(request: NextRequest) {
    try {
        await requireAdmin();

        const body = await request.json();
        const { couponId, ...updateData } = body;

        if (!couponId) {
            return NextResponse.json({ error: 'Coupon ID is required' }, { status: 400 });
        }

        // Convert numeric strings to proper types
        if (updateData.discountValue) {
            updateData.discountValue = parseFloat(updateData.discountValue);
        }
        if (updateData.minOrderValue) {
            updateData.minOrderValue = parseFloat(updateData.minOrderValue);
        }
        if (updateData.maxDiscount) {
            updateData.maxDiscount = parseFloat(updateData.maxDiscount);
        }
        if (updateData.usageLimit) {
            updateData.usageLimit = parseInt(updateData.usageLimit);
        }
        if (updateData.userLimit) {
            updateData.userLimit = parseInt(updateData.userLimit);
        }
        if (updateData.validFrom) {
            updateData.validFrom = new Date(updateData.validFrom);
        }
        if (updateData.validUntil) {
            updateData.validUntil = new Date(updateData.validUntil);
        }

        const updatedCoupon = await prisma.coupon.update({
            where: { id: couponId },
            data: updateData
        });

        return NextResponse.json(updatedCoupon);
    } catch (error) {
        console.error('Error updating coupon:', error);
        return NextResponse.json({ error: 'Failed to update coupon' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        await requireAdmin();

        const searchParams = request.nextUrl.searchParams;
        const couponId = searchParams.get('id');

        if (!couponId) {
            return NextResponse.json({ error: 'Coupon ID is required' }, { status: 400 });
        }

        await prisma.coupon.delete({
            where: { id: couponId }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting coupon:', error);
        return NextResponse.json({ error: 'Failed to delete coupon' }, { status: 500 });
    }
}

