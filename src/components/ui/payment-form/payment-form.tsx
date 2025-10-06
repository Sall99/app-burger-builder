'use client'

import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { useTranslations } from 'next-intl'

import { paymentAction } from '@/actions/payments'
import { useAppSelector } from '@/redux/hook'
import { selectIngredients } from '@/redux/selectors/ingredients'
import { selectShippingAddress } from '@/redux/selectors/shipping-address'
import { selectSubstitutions } from '@/redux/selectors/substitutions'
import { RootState } from '@/redux/store'

import { Button } from '..'

interface PaymentFormProps {
    setIsPaymeOpen: (isOpen: boolean) => void
}

export function PaymentForm({ setIsPaymeOpen }: PaymentFormProps) {
    const { shippingAddress } = useAppSelector(selectShippingAddress)
    const { totalPrice } = useAppSelector(selectIngredients)
    const { totalAdjustment: substitutionAdjustment } = useAppSelector(selectSubstitutions)
    const coupon = useAppSelector((state: RootState) => state.rootReducer.coupon)
    const [paymentError, setPaymentError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    const t = useTranslations('PaymentForm')

    // Calculate final price with substitutions and discounts
    const priceAfterSubstitutions = totalPrice + substitutionAdjustment
    const finalPrice = priceAfterSubstitutions - (coupon.appliedDiscount || 0)

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        setPaymentError(null)

        try {
            // Validate minimum order
            if (finalPrice <= 4) {
                setPaymentError(t('MinimumOrderError') || 'Minimum order amount not met')
                setLoading(false)
                return
            }

            // Create Stripe Checkout Session
            const result = await paymentAction({
                amount: finalPrice,
                shippingAddress
            })

            if (result && result.url) {
                // Redirect to Stripe Checkout
                window.location.href = result.url
            } else {
                throw new Error('No checkout URL received')
            }
        } catch (error: any) {
            console.error('Payment error:', error)
            const errorMessage =
                error?.response?.data?.error ||
                error?.message ||
                t('PaymentError') ||
                'Payment failed. Please try again.'
            setPaymentError(errorMessage)
            toast.error(errorMessage)
            setLoading(false)
        }
    }

    return (
        <div className="payment-form-container">
            <form onSubmit={onSubmit} className="payment-form">
                {/* Order Summary */}
                <div className="payment-summary">
                    <h3 className="payment-summary-title">
                        {t('OrderSummary') || 'Order Summary'}
                    </h3>
                    <div className="payment-summary-row">
                        <span>{t('Subtotal') || 'Subtotal'}:</span>
                        <span>${totalPrice.toFixed(2)}</span>
                    </div>
                    {substitutionAdjustment !== 0 && (
                        <div className="payment-summary-row">
                            <span>{t('Substitutions') || 'Substitutions'}:</span>
                            <span>
                                {substitutionAdjustment > 0 && '+'}$
                                {substitutionAdjustment.toFixed(2)}
                            </span>
                        </div>
                    )}
                    {coupon.isValid && coupon.appliedDiscount > 0 && (
                        <div className="payment-summary-row payment-discount">
                            <span>{t('Discount') || 'Discount'}:</span>
                            <span>-${coupon.appliedDiscount.toFixed(2)}</span>
                        </div>
                    )}
                    <div className="payment-summary-row payment-total">
                        <span>{t('Total') || 'Total'}:</span>
                        <span>${finalPrice.toFixed(2)}</span>
                    </div>
                </div>

                {/* Info Message */}
                <p className="payment-info-message">
                    {t('StripeRedirectMessage') ||
                        'You will be redirected to Stripe to complete your payment securely.'}
                </p>

                {/* Error Message */}
                {paymentError && <div className="payment-error-message">{paymentError}</div>}

                {/* Submit Button */}
                <Button
                    label={loading ? t('Redirecting') || 'Redirecting...' : t('PayNow')}
                    className="payment-submit-button"
                    loading={loading}
                    disabled={finalPrice <= 4}
                />

                {/* Security Note */}
                <p className="payment-security-note">
                    🔒 {t('SecurePayment') || 'Secure payment powered by Stripe'}
                </p>
            </form>
        </div>
    )
}
