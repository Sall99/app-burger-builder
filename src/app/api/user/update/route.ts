import bcrypt from 'bcrypt'
import { NextResponse } from 'next/server'

import prisma from '../../../../../libs/prisma.db'
import { getUserAndSession } from '../../../../../libs/session'

const HASH_SALT_ROUNDS = 10

const passwordsProvided = (currentPassword: string, newPassword: string) =>
    Boolean(currentPassword && newPassword)

const isCorrectPassword = async (inputPassword: string, storedPassword: string) =>
    bcrypt.compare(inputPassword, storedPassword)

const hashPassword = (password: string) => bcrypt.hash(password, HASH_SALT_ROUNDS)

const errorResponse = (message: string, status: number = 400) =>
    NextResponse.json({ error: message }, { status })

export async function POST(req: Request) {
    try {
        const { name, currentPassword, newPassword } = await req.json()
        const { user } = await getUserAndSession()

        if (!user || !user.email) return errorResponse('User email is required', 400)

        const { email, hashedPassword } = user

        if (!hashedPassword) return errorResponse('No password found for user', 400)

        const updatedData: { name?: string; hashedPassword?: string } = {}

        if (name) updatedData.name = name

        if (passwordsProvided(currentPassword, newPassword)) {
            const isCurrentPasswordValid = await isCorrectPassword(currentPassword, hashedPassword)
            if (!isCurrentPasswordValid) return errorResponse('Incorrect current password')

            const isNewPasswordSame = await isCorrectPassword(newPassword, hashedPassword)
            if (isNewPasswordSame)
                return errorResponse('New password must be different from current password')

            updatedData.hashedPassword = await hashPassword(newPassword)
        }

        if (!Object.keys(updatedData).length) {
            return errorResponse('No valid data to update', 400)
        }

        await prisma.user.update({
            where: { email },
            data: updatedData
        })

        const passwordUpdated = Boolean(updatedData.hashedPassword)
        return NextResponse.json({ message: 'User data updated successfully', passwordUpdated })
    } catch (error) {
        return errorResponse('Internal server error', 500)
    }
}
