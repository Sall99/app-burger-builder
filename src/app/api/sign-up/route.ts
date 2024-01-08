import bcrypt from 'bcrypt'
import prisma from '../../../../libs/prisma.db'
import { NextResponse } from 'next/server'

interface UserRequestBody {
    email: string
    password: string
    name: string
}

const HASH_SALT_ROUNDS = 10

const createUser = async (userData: UserRequestBody) => {
    const { email, name, password } = userData
    const hashedPassword = await bcrypt.hash(password, HASH_SALT_ROUNDS)
    const newUser = await prisma.user.create({
        data: {
            email,
            name,
            hashedPassword
        }
    })
    return newUser
}

async function userExists(email: string) {
    const existingUser = await prisma.user.findUnique({
        where: {
            email
        }
    })
    return existingUser !== null
}

export async function POST(request: Request) {
    const body = await request.json()

    const { email, name, password } = body

    if (!email || !name || !password) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const doesUserExist = await userExists(email)

    if (doesUserExist) {
        return NextResponse.json({ error: 'User with this email already exists' }, { status: 400 })
    }

    try {
        const newUser = await createUser(body)
        return NextResponse.json(newUser)
    } catch (error) {
        console.error('Error creating user:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
