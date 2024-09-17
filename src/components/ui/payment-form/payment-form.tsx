'use client'

import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { useTranslations } from 'next-intl'

import { paymentAction } from '@/actions/payments'
import { useAppSelector } from '@/redux/hook'
import { selectIngredients } from '@/redux/selectors/ingredients'
import { selectShippingAddress } from '@/redux/selectors/shipping-address'

import { Button } from '..'

interface PaymentFormProps {
    setIsPaymeOpen: (isOpen: boolean) => void
}

export function PaymentForm({ setIsPaymeOpen }: PaymentFormProps) {
    const stripe = useStripe()
    const elements = useElements()
    const { shippingAddress } = useAppSelector(selectShippingAddress)
    const { totalPrice } = useAppSelector(selectIngredients)
    const [paymentError, setPaymentError] = useState(null)
    const [loading, setLoading] = useState(false)

    const t = useTranslations('PaymentForm')

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const cardElement = elements?.getElement('card')
        setLoading(true)
        try {
            if (!stripe || !cardElement) return null

            const result = await paymentAction({
                amount: totalPrice,
                shippingAddress
            })

            if (result) {
                toast.success(t('PaymentSuccessful'))
                setIsPaymeOpen(false)
            }

            setLoading(false)
        } catch (error) {
            console.log(error)
            setLoading(false)
        }
    }

    return (
        <div className="payment-form-container">
            <form onSubmit={onSubmit} className="payment-form">
                <p className="text-xs mb-5">{t('EnterPaymentDetails')}</p>
                <CardElement className="card-element" options={{ hidePostalCode: true }} />
                {paymentError && <div className="error-message">{paymentError}</div>}
                <Button label={t('PayNow')} className="px-5 py-4 mt-5" loading={loading} />
            </form>
        </div>
    )
}
