import bcrypt from 'bcrypt'
import { NextRequest, NextResponse } from 'next/server'

import { withRateLimit } from '@/lib/rate-limit'

import prisma from '../../../../../libs/prisma.db'

interface UserRequestBody {
    email: string
    password: string
    name: string
}

const HASH_SALT_ROUNDS = 10
const MIN_PASSWORD_LENGTH = 8
const MAX_NAME_LENGTH = 60

/**
 * Validates email format
 */
function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
}

/**
 * Sanitizes user input
 */
function sanitizeInput(input: string): string {
    return input.trim().replace(/[<>]/g, '')
}

const createUser = async (userData: UserRequestBody) => {
    const { email, name, password } = userData
    const hashedPassword = await bcrypt.hash(password, HASH_SALT_ROUNDS)
    const newUser = await prisma.user.create({
        data: {
            email: sanitizeInput(email.toLowerCase()),
            name: sanitizeInput(name),
            hashedPassword
        }
    })
    // Don't return sensitive data
    const { hashedPassword: _, ...userWithoutPassword } = newUser
    return userWithoutPassword
}

async function userExists(email: string) {
    const existingUser = await prisma.user.findUnique({
        where: {
            email: email.toLowerCase()
        }
    })
    return existingUser !== null
}

export async function POST(request: NextRequest) {
    // Apply rate limiting: 5 sign-up attempts per minute
    const rateLimitResult = await withRateLimit(request, 'auth', 5)
    if (rateLimitResult !== true && 'status' in rateLimitResult) {
        return rateLimitResult
    }

    try {
        const body = await request.json()
        const { email, name, password } = body

        // Validate required fields
        if (!email || !name || !password) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        // Validate email format
        if (!isValidEmail(email)) {
            return NextResponse.json({ error: 'Invalid email format' }, { status: 400 })
        }

        // Validate password length
        if (password.length < MIN_PASSWORD_LENGTH) {
            return NextResponse.json(
                { error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters` },
                { status: 400 }
            )
        }

        // Validate name length
        if (name.length > MAX_NAME_LENGTH) {
            return NextResponse.json(
                { error: `Name must be less than ${MAX_NAME_LENGTH} characters` },
                { status: 400 }
            )
        }

        // Check if user already exists
        const doesUserExist = await userExists(email)

        if (doesUserExist) {
            return NextResponse.json(
                { error: 'An account with this email already exists' },
                { status: 400 }
            )
        }

        // Create new user
        const newUser = await createUser(body)
        return NextResponse.json(newUser, { status: 201 })
    } catch (error) {
        console.error('Error creating user:', error)
        // Don't expose internal error details
        return NextResponse.json(
            { error: 'Unable to create account. Please try again later.' },
            { status: 500 }
        )
    }
}
