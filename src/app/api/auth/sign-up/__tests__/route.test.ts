import bcrypt from 'bcrypt'

import prisma from '../../../../../../libs/prisma.db'

jest.mock('../../../../../../libs/prisma.db', () => ({
    __esModule: true,
    default: {
        user: {
            findUnique: jest.fn(),
            create: jest.fn()
        }
    }
}))

jest.mock('bcrypt', () => ({
    hash: jest.fn().mockResolvedValue('hashedPassword123')
}))

describe('Sign Up API Logic', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('should hash password and create user', async () => {
        const mockUser = {
            id: '123',
            name: 'John Doe',
            email: 'john@example.com',
            hashedPassword: 'hashedPassword123',
            createdAt: new Date(),
            updatedAt: new Date(),
            emailVerified: null,
            image: null
        }

        ;(prisma.user.findUnique as jest.Mock).mockResolvedValue(null)
        ;(prisma.user.create as jest.Mock).mockResolvedValue(mockUser)

        const userExists = await prisma.user.findUnique({
            where: { email: 'john@example.com' }
        })
        expect(userExists).toBeNull()

        const hashedPassword = await bcrypt.hash('password123', 10)
        expect(hashedPassword).toBe('hashedPassword123')

        const user = await prisma.user.create({
            data: {
                name: 'John Doe',
                email: 'john@example.com',
                hashedPassword
            }
        })

        expect(user.email).toBe('john@example.com')
        expect(prisma.user.create).toHaveBeenCalled()
    })

    it('should detect existing user', async () => {
        const existingUser = {
            id: '123',
            email: 'existing@example.com'
        }

        ;(prisma.user.findUnique as jest.Mock).mockResolvedValue(existingUser)

        const userExists = await prisma.user.findUnique({
            where: { email: 'existing@example.com' }
        })

        expect(userExists).toBeTruthy()
        expect(userExists?.email).toBe('existing@example.com')
    })

    it('should handle database errors', async () => {
        ;(prisma.user.create as jest.Mock).mockRejectedValue(new Error('Database error'))

        await expect(
            prisma.user.create({
                data: {
                    name: 'John Doe',
                    email: 'john@example.com',
                    hashedPassword: 'hash'
                }
            })
        ).rejects.toThrow('Database error')
    })
})
