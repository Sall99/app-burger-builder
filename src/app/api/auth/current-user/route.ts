import { NextRequest, NextResponse } from 'next/server'

import prisma from '../../../../../libs/prisma.db'
import { getUserAndSession } from '../../../../../libs/session'

export async function GET(req: NextRequest, res: NextResponse) {
    try {
        const { user } = await getUserAndSession()

        const userData = await prisma.user.findUnique({
            where: { id: user.id },
            select: {
                id: true,
                email: true,
                name: true
            }
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
