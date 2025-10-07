import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'

import { authOptions } from '../../../../../libs/authOptions'
import prisma from '../../../../../libs/prisma.db'

export async function GET(req: NextRequest, res: NextResponse) {
    try {
        const session = await getServerSession(authOptions)

        if (!session || !session.user || !session.user.email) {
            throw new Error('Unauthorized')
        }

        const userData = await prisma.user.findUnique({
            where: { email: session.user.email }
        })

        return NextResponse.json(
            {
                message: 'success',
                user: userData
            },
            { status: 200 }
        )
    } catch (error) {
        return NextResponse.json({ error })
    }
}
