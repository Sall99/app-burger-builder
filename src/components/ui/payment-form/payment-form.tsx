'use client'
import React from 'react'
import axios from 'axios'
import { useElements, useStripe, CardElement } from '@stripe/react-stripe-js'
import { Button } from '..'

export function PaymentForm() {
    const stripe = useStripe()
    const elements = useElements()

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const cardElement = elements?.getElement('card')

        try {
            if (!stripe || !cardElement) return null
            const { data } = await axios.post('/api/create-payment-intent', {
                data: { amount: 89 }
            })
            const clientSecret = data

            await stripe?.confirmCardPayment(clientSecret, {
                payment_method: { card: cardElement }
            })
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="payment-form-container">
            <form onSubmit={onSubmit} className="payment-form">
                <p className="text-xs mb-5">
                    Enter your payment details below to complete your purchase:
                </p>
                <CardElement className="card-element" />
                <Button label="Pay Now" className="px-5 py-4 mt-5" />
            </form>
        </div>
    )
}
