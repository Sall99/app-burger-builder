'use client'

import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { CreditCard, ShieldCheck } from 'lucide-react'
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

export function PaymentForm({ setIsPaymeOpen: _setIsPaymeOpen }: PaymentFormProps) {
    const { shippingAddress } = useAppSelector(selectShippingAddress)
    const { ingredients, totalPrice } = useAppSelector(selectIngredients)
    const { totalAdjustment: substitutionAdjustment, appliedSubstitutions } =
        useAppSelector(selectSubstitutions)
    const coupon = useAppSelector((state: RootState) => state.rootReducer.coupon)
    const [paymentError, setPaymentError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    const t = useTranslations('PaymentForm')

    const priceAfterSubstitutions = totalPrice + substitutionAdjustment
    const finalPrice = Math.max(0, priceAfterSubstitutions - (coupon.appliedDiscount || 0))

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        setPaymentError(null)

        try {
            if (finalPrice <= 4) {
                setPaymentError(t('MinimumOrderError') || 'Minimum order amount not met')
                setLoading(false)
                return
            }

            const result = await paymentAction({
                amount: finalPrice,
                shippingAddress,
                ingredients,
                substitutions: appliedSubstitutions,
                coupon: coupon.isValid
                    ? {
                          code: coupon.code,
                          discount: coupon.appliedDiscount
                      }
                    : null
            })

            if (result && result.url) {
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
        <form onSubmit={onSubmit} className="space-y-4">
            <div className="rounded-xl border border-zinc-200/80 bg-zinc-50/70 p-4 space-y-2.5 text-sm">
                <div className="flex items-center gap-2 pb-2.5 border-b border-zinc-200/80">
                    <CreditCard size={15} className="text-zinc-700" />
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-600">
                        {t('OrderSummary') || 'Order Summary'}
                    </h4>
                </div>

                <div className="flex justify-between text-zinc-500 text-xs">
                    <span>{t('Subtotal') || 'Subtotal'}</span>
                    <span className="font-medium tabular-nums text-zinc-900">
                        ${totalPrice.toFixed(2)}
                    </span>
                </div>

                {substitutionAdjustment !== 0 && (
                    <div className="flex justify-between text-zinc-500 text-xs">
                        <span>{t('Substitutions') || 'Substitutions'}</span>
                        <span className="font-medium tabular-nums text-zinc-900">
                            {substitutionAdjustment > 0 && '+'}${substitutionAdjustment.toFixed(2)}
                        </span>
                    </div>
                )}

                {coupon.isValid && coupon.appliedDiscount > 0 && (
                    <div className="flex justify-between text-emerald-700 text-xs font-medium">
                        <span>{t('Discount') || 'Discount'}</span>
                        <span className="font-semibold tabular-nums">
                            -${coupon.appliedDiscount.toFixed(2)}
                        </span>
                    </div>
                )}

                <div className="flex items-baseline justify-between pt-2.5 border-t border-zinc-200/80">
                    <span className="text-sm font-semibold text-zinc-950">
                        {t('Total') || 'Total'}
                    </span>
                    <span className="text-xl font-semibold tracking-tight tabular-nums text-zinc-950">
                        ${finalPrice.toFixed(2)}
                    </span>
                </div>
            </div>

            <p className="text-xs leading-relaxed text-zinc-500 text-center">
                {t('StripeRedirectMessage') ||
                    'You will be redirected to Stripe to complete your payment securely.'}
            </p>

            {paymentError && (
                <div className="rounded-xl border border-red-200 bg-red-50/70 px-3.5 py-2.5 text-xs font-medium text-red-700">
                    {paymentError}
                </div>
            )}

            <Button
                type="submit"
                label={loading ? t('Redirecting') || 'Redirecting...' : t('PayNow')}
                className="w-full py-3 text-sm font-medium"
                loading={loading}
                disabled={finalPrice <= 4}
            />

            <p className="flex items-center justify-center gap-1.5 text-xs text-zinc-400">
                <ShieldCheck size={14} className="text-emerald-600" />
                <span>{t('SecurePayment') || 'Secure payment powered by Stripe'}</span>
            </p>
        </form>
    )
}
