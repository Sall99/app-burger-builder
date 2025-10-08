import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.NEXT_STRIPE_SECRET_KEY!, {
    typescript: true
})

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url)
        const sessionId = searchParams.get('session_id')

        if (!sessionId) {
            return NextResponse.json({ error: 'Session ID is required' }, { status: 400 })
        }

        const session = await stripe.checkout.sessions.retrieve(sessionId)

        return NextResponse.json(
            {
                orderId: session.metadata?.orderId,
                status: session.payment_status,
                customerEmail: session.customer_email
            },
            { status: 200 }
        )
    } catch (error) {
        console.error('Error retrieving Stripe session:', error)
        return NextResponse.json({ error: 'Unable to retrieve session' }, { status: 500 })
    }
}
