import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'

import { authOptions } from '../../../../../libs/authOptions'
import prisma from '../../../../../libs/prisma.db'

export const dynamic = 'force-dynamic'

export async function GET() {
    try {
        const session = await getServerSession(authOptions)

        if (!session || !session.user || !session.user.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const userData = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: {
                id: true,
                name: true,
                email: true,
                image: true,
                role: true,
                emailVerified: true,
                createdAt: true,
                updatedAt: true
            }
        })

        if (!userData) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        return NextResponse.json(
            {
                message: 'success',
                user: userData
            },
            { status: 200 }
        )
    } catch (error) {
        console.error('Error fetching current user:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
