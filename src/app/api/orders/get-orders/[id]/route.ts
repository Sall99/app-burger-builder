import { NextRequest, NextResponse } from 'next/server'

import prisma from '../../../../../../libs/prisma.db'
import { getUserAndSession } from '../../../../../../libs/session'

export const dynamic = 'force-dynamic'

type Params = {
    id: string
}

export async function GET(_req: NextRequest, context: { params: Params }) {
    const { id } = context.params

    try {
        const { user } = await getUserAndSession()
        const isAdmin = user.role === 'ADMIN' || user.role === 'SUPER_ADMIN'

        const order = await prisma.order.findFirst({
            where: isAdmin ? { id } : { id, userId: user.id },
            include: {
                shippingAdresse: true
            }
        })

        if (!order) {
            return NextResponse.json({ message: 'Order entry not found' }, { status: 404 })
        }

        return NextResponse.json({ order }, { status: 200 })
    } catch (error) {
        if (error instanceof Error && error.message === 'Unauthorized') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }
        return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 })
    }
}
