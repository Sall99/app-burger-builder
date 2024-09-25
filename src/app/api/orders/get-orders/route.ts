import { NextRequest, NextResponse } from 'next/server'

import { prisma } from '../../../../../libs/prisma.db'
import { getUserAndSession } from '../../../../../libs/session'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
    try {
        const { user } = await getUserAndSession()

        const orders = await prisma.order.findMany({
            where: {
                userId: user.id
            },
            include: {
                shippingAdresse: true
            }
        })

        return NextResponse.json({ orders }, { status: 200 })
    } catch (error) {
        console.error('Error fetching orders:', error)
        if (error instanceof Error && error.message === 'Unauthorized') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
