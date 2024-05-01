import { SafeUser } from '@/types'
import prisma from '../../../libs/prisma.db'
import { getSession } from 'next-auth/react'

async function getCurrentUser(): Promise<SafeUser | null> {
    try {
        const session = await getSession()

        if (!session?.user?.email) {
            return null
        }

        const currentUser = await prisma.user.findUnique({
            where: {
                email: session.user.email as string
            }
        })

        if (!currentUser) {
            return null
        }

        const createdAtDate = new Date(currentUser.createdAt)

        const safeUser: SafeUser = {
            id: currentUser.id,
            name: currentUser.name,
            email: currentUser.email,
            image: currentUser.image,
            hashedPassword: currentUser.hashedPassword,
            createdAt: createdAtDate
        }
        return safeUser
    } catch (error) {
        console.error('Error in getCurrentUser:', error)
        throw error
    }
}

export default getCurrentUser
