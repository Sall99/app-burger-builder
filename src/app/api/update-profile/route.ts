import { NextResponse } from 'next/server'
import bcrypt from 'bcrypt'

import prisma from '../../../../libs/prisma.db'
import { getSession } from '@/app/actions/current-user'

interface UserRequestBody {
    name: string
    password: string
}
const HASH_SALT_ROUNDS = 10

async function getUserData(email: string) {
    const existingUser = await prisma.user.findUnique({
        where: {
            email
        }
    })
    return existingUser
}

async function comparePassword(password: string, newPassword: string) {
    console.log(password, newPassword)
    if (password !== undefined) {
        const isPassword = bcrypt.compareSync(newPassword, password)
        return isPassword
    }
}

export async function POST(req: Request, res: NextResponse) {
    const body = await req.json()
    const { name, password } = body

    const session = await getSession()
    if (!session) {
        return NextResponse.json({
            errror: 'Unauthorized',
            status: '401'
        })
    }
    const userEmail = session.user?.email ?? ''
    const userData = await getUserData(userEmail)
    const existingPassword = userData?.hashedPassword ?? ''

    let updatedData: UserRequestBody = {
        name,
        password
    }

    if (name) {
        updatedData.name = name
    }

    if (password) {
        const isPassword = await comparePassword(existingPassword, password)
        if (isPassword) {
            return NextResponse.json({ error: 'The new password should be different', status: 400 })
        }

        const hashedPassword = await bcrypt.hash(password, HASH_SALT_ROUNDS)
        updatedData.password = hashedPassword
    }

    const passwordUpdated = 'password' in updatedData
    try {
        await prisma.user.update({
            where: { email: userEmail },
            data: updatedData
        })
        return NextResponse.json({ message: 'User data updated successfully', passwordUpdated })
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
