import { getServerSession } from 'next-auth'

import { prisma } from './prisma.db'

export async function getUserAndSession() {
    const session = await getServerSession()

    if (!session || !session.user || !session.user.email) {
        throw new Error('Unauthorized')
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email }
    })

    if (!user) {
        throw new Error('User not found')
    }

    return { session, user }
}
