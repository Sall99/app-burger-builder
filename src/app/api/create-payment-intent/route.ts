import { OrderStatus } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

import { shippingAddressFormValues } from '@/types'

import prisma from '../../../../libs/prisma.db'
import { getUserAndSession } from '../../../../libs/session'

const stripe = new Stripe(process.env.NEXT_STRIPE_SECRET_KEY!, {
    typescript: true
})

async function createOrder(
    userId: string,
    amount: number,
    shippingAddress: shippingAddressFormValues,
    payment_status: boolean
) {
    try {
        const createdShippingAddress = await prisma.address.create({
            data: {
                userId,
                ...shippingAddress
            }
        })

        const orderData = {
            userId,
            totalPrice: amount,
            status: OrderStatus.PENDING,
            payment_status,
            shippingAdresseId: createdShippingAddress.id
        }

        return await prisma.order.create({ data: orderData })
    } catch (error) {
        console.error('Error creating order:', error)
        throw new Error('Failed to create order')
    }
}

export async function POST(req: NextRequest) {
    try {
        const { data } = await req.json()
        const { amount, shippingAddress } = data

        // Validate input
        if (!amount || !shippingAddress) {
            return NextResponse.json({ error: 'Invalid request data' }, { status: 400 })
        }

        // Validate amount (prevent negative or excessively large amounts)
        if (amount <= 0 || amount > 10000) {
            return NextResponse.json({ error: 'Invalid order amount' }, { status: 400 })
        }

        const { user } = await getUserAndSession()

        if (!user || !user.email) {
            return NextResponse.json(
                { error: 'You must be logged in to create an order' },
                { status: 401 }
            )
        }

        // Get base URL from environment or request
        const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'

        // Create Stripe checkout session (proper way, not using hardcoded tokens)
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            customer_email: user.email,
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: 'Burger Order',
                            description: 'Custom burger order'
                        },
                        unit_amount: Math.round(amount * 100) // Convert to cents
                    },
                    quantity: 1
                }
            ],
            mode: 'payment',
            success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${baseUrl}/cancel`,
            metadata: {
                userId: user.id,
                shippingAddress: JSON.stringify(shippingAddress)
            }
        })

        // Create order with pending payment status
        // Payment status will be updated via webhook when payment succeeds
        const order = await createOrder(user.id, amount, shippingAddress, false)

        return NextResponse.json(
            {
                sessionId: session.id,
                url: session.url,
                orderId: order.id
            },
            { status: 200 }
        )
    } catch (error) {
        console.error('Payment processing error:', error)

        // Don't expose internal error details to client
        return NextResponse.json(
            { error: 'Unable to process payment. Please try again later.' },
            { status: 500 }
        )
    }
}
