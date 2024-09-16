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

        if (!amount || !shippingAddress) {
            return NextResponse.json({ error: 'Invalid request data' }, { status: 400 })
        }

        const { user } = await getUserAndSession()

        if (!user || !user.email) {
            return NextResponse.json(
                { error: 'You must be logged in to create an order' },
                { status: 401 }
            )
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'USD',
                        product_data: {
                            name: 'Order'
                        },
                        unit_amount: amount * 100
                    },
                    quantity: 1
                }
            ],
            mode: 'payment',
            success_url: 'http://localhost:3000/success',
            cancel_url: 'http://localhost:3000/cancel'
        })

        const charge = await stripe.charges.create({
            amount: amount * 100,
            currency: 'usd',
            description: 'Order',
            source: 'tok_visa'
        })

        if (charge.status !== 'succeeded') {
            return NextResponse.json({ error: 'Payment failed' }, { status: 400 })
        }

        await createOrder(user.id, amount, shippingAddress, true)

        return NextResponse.json({ status: 'succeeded' }, { status: 200 })
    } catch (error) {
        console.error('Payment processing error:', error)
        return NextResponse.json(
            { error: 'An error occurred while processing the payment' },
            { status: 500 }
        )
    }
}
