import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'

import prisma from '../../../../../libs/prisma.db'

export async function GET(req: NextRequest, res: NextResponse) {
    try {
        const session = await getServerSession()

        const userData = await prisma.user.findUnique({
            where: { email: session?.user?.email || '' },
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
