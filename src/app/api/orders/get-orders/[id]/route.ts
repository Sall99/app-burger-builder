import { NextApiRequest } from 'next'
import { NextResponse } from 'next/server'

import prisma from '../../../../../../libs/prisma.db'
import { getUserAndSession } from '../../../../../../libs/session'

type Params = {
    id: string
}

export async function GET(req: NextApiRequest, context: { params: Params }, res: NextResponse) {
    const { id } = context.params

    console

    try {
        await getUserAndSession()

        const order = await prisma.order.findFirst({
            where: { id }
        })

        if (!order) {
            return NextResponse.json(
                {
                    message: 'Order entry not found'
                },
                { status: 404 }
            )
        }

        return NextResponse.json(
            {
                order
            },
            { status: 200 }
        )
    } catch (error) {
        return NextResponse.json({ error })
    }
}
