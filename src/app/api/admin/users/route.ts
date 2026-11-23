import { NextRequest, NextResponse } from 'next/server'

import { getAdminSession, requireAdmin } from '@/lib/admin'

import prisma from '../../../../../libs/prisma.db'

export const dynamic = 'force-dynamic'

const VALID_ROLES = ['USER', 'ADMIN', 'SUPER_ADMIN'] as const
const VALID_TIERS = ['BRONZE', 'SILVER', 'GOLD', 'PLATINUM'] as const

export async function GET(request: NextRequest) {
    try {
        await requireAdmin()

        const searchParams = request.nextUrl.searchParams
        const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
        const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '10')))
        const search = (searchParams.get('search') || '').trim()
        const roleFilter = searchParams.get('role') || undefined
        const skip = (page - 1) * limit

        const where: Record<string, any> = {}
        if (roleFilter && VALID_ROLES.includes(roleFilter as any)) {
            where.role = roleFilter
        }
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } }
            ]
        }

        const [rawUsers, total, allUsersForSummary] = await Promise.all([
            prisma.user.findMany({
                where,
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    createdAt: true,
                    emailVerified: true,
                    loyalty: {
                        select: {
                            totalPoints: true,
                            availablePoints: true,
                            currentTier: true,
                            lifetimeSpend: true
                        }
                    },
                    Order: {
                        select: {
                            totalPrice: true,
                            payment_status: true
                        }
                    },
                    _count: {
                        select: {
                            Order: true
                        }
                    }
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit
            }),
            prisma.user.count({ where }),
            prisma.user.findMany({
                select: {
                    role: true,
                    emailVerified: true,
                    loyalty: { select: { id: true } }
                }
            })
        ])

        const users = rawUsers.map((u) => {
            const totalSpent = u.Order.reduce((sum, o) => sum + (o.totalPrice || 0), 0)
            const paidOrdersCount = u.Order.filter((o) => o.payment_status).length
            return {
                id: u.id,
                name: u.name,
                email: u.email,
                role: u.role,
                createdAt: u.createdAt,
                emailVerified: u.emailVerified,
                _count: u._count,
                totalSpent: Number(totalSpent.toFixed(2)),
                paidOrdersCount,
                loyalty: u.loyalty
            }
        })

        const summary = {
            total: allUsersForSummary.length,
            admins: allUsersForSummary.filter(
                (u) => u.role === 'ADMIN' || u.role === 'SUPER_ADMIN'
            ).length,
            verified: allUsersForSummary.filter((u) => Boolean(u.emailVerified)).length,
            loyaltyMembers: allUsersForSummary.filter((u) => Boolean(u.loyalty)).length
        }

        return NextResponse.json({
            users,
            summary,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.max(1, Math.ceil(total / limit))
            }
        })
    } catch (error) {
        console.error('Error fetching users:', error)
        return NextResponse.json({ error: 'Unauthorized or server error' }, { status: 401 })
    }
}

export async function PATCH(request: NextRequest) {
    try {
        await requireAdmin()

        const body = await request.json()
        const { userId, role, name, verifyEmail, loyaltyPointsDelta, loyaltyTier } = body

        if (!userId) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
        }

        const userUpdate: Record<string, any> = {}
        if (role && VALID_ROLES.includes(role)) {
            userUpdate.role = role
        }
        if (typeof name === 'string') {
            userUpdate.name = name.trim()
        }
        if (typeof verifyEmail === 'boolean') {
            userUpdate.emailVerified = verifyEmail ? new Date() : null
        }

        if (Object.keys(userUpdate).length > 0) {
            await prisma.user.update({
                where: { id: userId },
                data: userUpdate
            })
        }

        // Loyalty points / tier adjustment
        if (typeof loyaltyPointsDelta === 'number' || (loyaltyTier && VALID_TIERS.includes(loyaltyTier))) {
            const existingLoyalty = await prisma.loyalty.findUnique({
                where: { userId }
            })
            const delta = typeof loyaltyPointsDelta === 'number' ? Math.round(loyaltyPointsDelta) : 0
            const nextAvailable = Math.max(0, (existingLoyalty?.availablePoints || 0) + delta)
            const nextTotal = Math.max(
                nextAvailable,
                (existingLoyalty?.totalPoints || 0) + (delta > 0 ? delta : 0)
            )
            const tierToSet =
                loyaltyTier && VALID_TIERS.includes(loyaltyTier)
                    ? loyaltyTier
                    : existingLoyalty?.currentTier || 'BRONZE'

            await prisma.loyalty.upsert({
                where: { userId },
                create: {
                    userId,
                    availablePoints: nextAvailable,
                    totalPoints: nextTotal,
                    currentTier: tierToSet
                },
                update: {
                    availablePoints: nextAvailable,
                    totalPoints: nextTotal,
                    currentTier: tierToSet
                }
            })
        }

        const updatedUser = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
                emailVerified: true,
                loyalty: {
                    select: {
                        totalPoints: true,
                        availablePoints: true,
                        currentTier: true,
                        lifetimeSpend: true
                    }
                }
            }
        })

        return NextResponse.json(updatedUser)
    } catch (error) {
        console.error('Error updating user:', error)
        return NextResponse.json({ error: 'Failed to update user' }, { status: 500 })
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const session = await getAdminSession()
        const searchParams = request.nextUrl.searchParams
        const userId = searchParams.get('id')

        if (!userId) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
        }

        const target = await prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, email: true }
        })

        if (!target) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        if (target.email && target.email === session.user?.email) {
            return NextResponse.json(
                { error: 'You cannot delete your own active admin account' },
                { status: 400 }
            )
        }

        await prisma.couponUsage.deleteMany({ where: { userId } })
        await prisma.order.deleteMany({ where: { userId } })
        await prisma.user.delete({ where: { id: userId } })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error deleting user:', error)
        return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 })
    }
}
