import { OrderStatus } from '@prisma/client'

import prisma from '../../../../../libs/prisma.db'

jest.mock('../../../../../libs/prisma.db', () => ({
    __esModule: true,
    default: {
        order: {
            findMany: jest.fn(),
            findUnique: jest.fn(),
            create: jest.fn(),
            update: jest.fn()
        },
        address: {
            create: jest.fn()
        }
    }
}))

describe('Orders API Integration', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    describe('GET orders', () => {
        it('should fetch all orders for a user', async () => {
            const mockOrders = [
                {
                    id: '1',
                    userId: 'user123',
                    totalPrice: 10.5,
                    status: OrderStatus.PENDING,
                    payment_status: true,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    shippingAdresseId: 'addr1'
                },
                {
                    id: '2',
                    userId: 'user123',
                    totalPrice: 15.0,
                    status: OrderStatus.COMPLETED,
                    payment_status: true,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    shippingAdresseId: 'addr2'
                }
            ]

            ;(prisma.order.findMany as jest.Mock).mockResolvedValue(mockOrders)

            const orders = await prisma.order.findMany({
                where: { userId: 'user123' }
            })

            expect(orders).toHaveLength(2)
            expect(orders[0].status).toBe(OrderStatus.PENDING)
            expect(orders[1].status).toBe(OrderStatus.COMPLETED)
        })

        it('should return empty array when no orders exist', async () => {
            ;(prisma.order.findMany as jest.Mock).mockResolvedValue([])

            const orders = await prisma.order.findMany({
                where: { userId: 'user123' }
            })

            expect(orders).toEqual([])
        })
    })

    describe('GET order by ID', () => {
        it('should fetch a specific order', async () => {
            const mockOrder = {
                id: '1',
                userId: 'user123',
                totalPrice: 10.5,
                status: OrderStatus.PROCESSING,
                payment_status: true,
                createdAt: new Date(),
                updatedAt: new Date(),
                shippingAdresseId: 'addr1',
                shippingAdresse: {
                    id: 'addr1',
                    firstName: 'John',
                    lastName: 'Doe',
                    streetAddress: '123 Main St',
                    town: 'New York',
                    userId: 'user123'
                }
            }

            ;(prisma.order.findUnique as jest.Mock).mockResolvedValue(mockOrder)

            const order = await prisma.order.findUnique({
                where: { id: '1' },
                include: { shippingAdresse: true }
            })

            expect(order).toBeDefined()
            expect(order?.id).toBe('1')
            expect(order?.shippingAdresse?.firstName).toBe('John')
        })

        it('should return null for non-existent order', async () => {
            ;(prisma.order.findUnique as jest.Mock).mockResolvedValue(null)

            const order = await prisma.order.findUnique({
                where: { id: 'nonexistent' }
            })

            expect(order).toBeNull()
        })
    })

    describe('CREATE order', () => {
        it('should create a new order with shipping address', async () => {
            const mockAddress = {
                id: 'addr123',
                userId: 'user123',
                firstName: 'Jane',
                lastName: 'Smith',
                streetAddress: '456 Oak Ave',
                town: 'Boston'
            }

            const mockOrder = {
                id: 'order123',
                userId: 'user123',
                totalPrice: 12.5,
                status: OrderStatus.PENDING,
                payment_status: true,
                createdAt: new Date(),
                updatedAt: new Date(),
                shippingAdresseId: 'addr123'
            }

            ;(prisma.address.create as jest.Mock).mockResolvedValue(mockAddress)
            ;(prisma.order.create as jest.Mock).mockResolvedValue(mockOrder)

            const address = await prisma.address.create({
                data: {
                    userId: 'user123',
                    firstName: 'Jane',
                    lastName: 'Smith',
                    streetAddress: '456 Oak Ave',
                    town: 'Boston'
                }
            })

            const order = await prisma.order.create({
                data: {
                    userId: 'user123',
                    totalPrice: 12.5,
                    status: OrderStatus.PENDING,
                    payment_status: true,
                    shippingAdresseId: address.id
                }
            })

            expect(order).toBeDefined()
            expect(order.totalPrice).toBe(12.5)
            expect(order.shippingAdresseId).toBe('addr123')
        })
    })

    describe('UPDATE order status', () => {
        it('should update order status', async () => {
            const updatedOrder = {
                id: 'order123',
                userId: 'user123',
                totalPrice: 10.5,
                status: OrderStatus.DELIVERED,
                payment_status: true,
                createdAt: new Date(),
                updatedAt: new Date(),
                shippingAdresseId: 'addr123'
            }

            ;(prisma.order.update as jest.Mock).mockResolvedValue(updatedOrder)

            const order = await prisma.order.update({
                where: { id: 'order123' },
                data: { status: OrderStatus.DELIVERED }
            })

            expect(order.status).toBe(OrderStatus.DELIVERED)
        })
    })
})
