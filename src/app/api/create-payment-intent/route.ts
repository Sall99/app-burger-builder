import { NextResponse, NextRequest } from 'next/server'
import Stripe from 'stripe'
import prisma from '../../../../libs/prisma.db'
import { getSession } from '@/app/actions/current-user'

const stripe = new Stripe(process.env.NEXT_STRIPE_SECRET_KEY!, {
    typescript: true
})

type ShippingAddress = {
    firstName: string
    lastName: string
    streetAddress: string
    town: string
}

async function createOrder(
    userId: string,
    amount: number,
    shippingAddress: ShippingAddress,
    payment_status: boolean
) {
    const createdShippingAddress = await prisma?.address.create({
        data: {
            userId,
            ...shippingAddress
        }
    })

    const orderData = {
        userId,
        totalPrice: amount,
        status: 'PENDING',
        shippingAdresseId: createdShippingAddress?.id ? createdShippingAddress.id : undefined,
        payment_status
    }

    // @ts-ignore
    return await prisma?.order.create({ data: orderData })
}

export async function POST(req: NextRequest) {
    try {
        const { data, payment_method } = await req.json()
        const { amount, shippingAddress } = data

        const { firstName, lastName, streetAddress, town } = shippingAddress
        const strippedShippingAddress = { line1: streetAddress, city: town, country: 'US' }

        const paymentIntent = await stripe.checkout.sessions.create({
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
            success_url: `http://localhost:3000/success`,
            cancel_url: `http://localhost:3000/cancel`
        })

        const charge = await stripe.charges.create({
            amount: amount * 100,
            currency: 'eur',
            description: 'Commande',
            source: 'tok_visa'
        })

        const session = await getSession()

        if (!session?.user?.email) {
            return NextResponse.json(
                { error: 'You must be logged in to create an order' },
                { status: 401 }
            )
        }

        const currentUser = await prisma.user.findUnique({
            where: {
                email: session.user.email as string
            }
        })

        if (!currentUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        const userId = currentUser?.id

        const payment_status = true

        await createOrder(userId, amount, shippingAddress, payment_status)

        return new NextResponse(charge.status, { status: 200 })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
