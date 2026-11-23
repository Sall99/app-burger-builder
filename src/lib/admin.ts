import { getServerSession } from 'next-auth'

import { authOptions } from '../../libs/authOptions'
import prisma from '../../libs/prisma.db'

export async function isAdmin() {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
        return false
    }

    if (session.user.email) {
        try {
            const dbUser = await prisma.user.findUnique({
                where: { email: session.user.email },
                select: { role: true }
            })
            if (dbUser) {
                return dbUser.role === 'ADMIN' || dbUser.role === 'SUPER_ADMIN'
            }
        } catch {
            // Fall back to session token role only if DB is unreachable
        }
    }

    const tokenRole = (session.user as any).role
    return tokenRole === 'ADMIN' || tokenRole === 'SUPER_ADMIN'
}

export async function requireAdmin() {
    const admin = await isAdmin()

    if (!admin) {
        throw new Error('Unauthorized: Admin access required')
    }

    return true
}

export async function getAdminSession() {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
        throw new Error('Unauthorized')
    }

    const admin = await isAdmin()
    if (!admin) {
        throw new Error('Unauthorized: Admin access required')
    }

    return session
}
