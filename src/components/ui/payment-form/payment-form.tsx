'use client'
import React, { useState } from 'react'
import axios from 'axios'
import { useElements, useStripe, CardElement } from '@stripe/react-stripe-js'
import { useAppSelector } from '@/redux/hook'

import { Button } from '..'
import { selectShippingAddress } from '@/redux/selectors/shipping-address'
import { selectIngredients } from '@/redux/selectors/ingredients'

export function PaymentForm() {
    const stripe = useStripe()
    const elements = useElements()
    const { shippingAddress } = useAppSelector(selectShippingAddress)
    const { totalPrice } = useAppSelector(selectIngredients)
    const [paymentError, setPaymentError] = useState(null)

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const cardElement = elements?.getElement('card')

        try {
            if (!stripe || !cardElement) return null
            const { data } = await axios.post('/api/create-payment-intent', {
                data: { amount: totalPrice, shippingAddress }
            })

            console.log(data)
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
                <CardElement className="card-element" options={{ hidePostalCode: true }} />
                {paymentError && <div className="error-message">{paymentError}</div>}
                <Button label="Pay Now" className="px-5 py-4 mt-5" />
            </form>
        </div>
    )
}
