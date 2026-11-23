'use client'

import { useState } from 'react'
import { useSelector } from 'react-redux'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { ArrowRight, ChevronDown, Tag } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useLocale, useTranslations } from 'next-intl'

import { selectIngredients } from '@/redux/selectors/ingredients'
import { selectSubstitutions } from '@/redux/selectors/substitutions'
import { RootState } from '@/redux/store'
import { totalFormatter } from '@/utils/utils'

import { CouponInput } from '../coupon'
import { Modal } from '../modal/modal'
import { ShippingAddress } from '../shipping-address'
import { PaymentForm } from '..'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export const Total = () => {
    const session = useSession()
    const t = useTranslations('Total')
    const locale = useLocale()
    const isFr = locale === 'fr'

    const { ingredients, totalPrice } = useSelector(selectIngredients)
    const coupon = useSelector((state: RootState) => state.rootReducer.coupon)
    const { totalAdjustment: substitutionAdjustment } = useSelector(selectSubstitutions)
    const [isPaymentOpen, setIsPaymeOpen] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const [showPromo, setShowPromo] = useState(false)
    const { meat, salad, bacon, cheese } = ingredients

    const priceAfterSubstitutions = totalPrice + substitutionAdjustment
    const finalPrice = Math.max(0, priceAfterSubstitutions - (coupon.appliedDiscount || 0))
    const canOrder = finalPrice > 4

    const handleOrder = () => {
        if (typeof window !== 'undefined' && window.dataLayer) {
            window.dataLayer.push({
                event: 'orderInitiated',
                orderDetails: { meat, salad, bacon, cheese, totalPrice }
            })
        }
        setIsOpen(true)
    }

    const handlePayment = () => {
        setIsOpen(false)
        setIsPaymeOpen(true)
    }

    return (
        <aside className="rounded-xl border border-surface-border bg-white p-5 space-y-4">
            {/* Header + Promo Toggle */}
            <div className="flex items-center justify-between gap-2 pb-3 border-b border-surface-border">
                <span className="font-display text-sm font-bold text-ink">
                    {isFr ? 'Récapitulatif' : 'Order Summary'}
                </span>

                <button
                    type="button"
                    onClick={() => setShowPromo((prev) => !prev)}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-ink-muted hover:text-ink transition-colors">
                    <Tag size={12} />
                    <span>
                        {coupon.isValid
                            ? coupon.code
                            : isFr
                              ? 'Code promo'
                              : 'Promo code'}
                    </span>
                    <ChevronDown
                        size={13}
                        className={`transition-transform ${showPromo || coupon.isValid ? 'rotate-180' : ''}`}
                    />
                </button>
            </div>

            {(showPromo || coupon.isValid) && (
                <div>
                    <CouponInput orderTotal={totalPrice} />
                </div>
            )}

            {/* Price Breakdown */}
            <div className="space-y-1.5 text-sm">
                <div className="flex justify-between text-ink-muted">
                    <span>{t('Subtotal')}</span>
                    <span className="tabular-nums font-medium text-ink">
                        {totalFormatter.format(totalPrice)}
                    </span>
                </div>

                {substitutionAdjustment !== 0 && (
                    <div className="flex justify-between text-ink-muted">
                        <span>{t('Substitutions') || 'Substitutions'}</span>
                        <span className="tabular-nums font-medium text-ink">
                            {substitutionAdjustment > 0 ? '+' : ''}
                            {totalFormatter.format(substitutionAdjustment)}
                        </span>
                    </div>
                )}

                {coupon.isValid && coupon.appliedDiscount > 0 && (
                    <div className="flex justify-between text-fresh-700 font-medium">
                        <span>{t('Discount') || 'Discount'}</span>
                        <span className="tabular-nums">
                            -{totalFormatter.format(coupon.appliedDiscount)}
                        </span>
                    </div>
                )}

                <div className="flex items-baseline justify-between border-t border-surface-border pt-3">
                    <span className="text-sm font-semibold text-ink">{t('Total')}</span>
                    <span className="tabular-nums text-xl font-bold tracking-tight text-ink">
                        {totalFormatter.format(finalPrice)}
                    </span>
                </div>
            </div>

            {/* Primary CTA */}
            <button
                type="button"
                onClick={handleOrder}
                disabled={!canOrder}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-500 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-600 disabled:bg-surface-muted disabled:text-ink-subtle disabled:cursor-not-allowed">
                <span>
                    {canOrder
                        ? `${t('Order')} · ${totalFormatter.format(finalPrice)}`
                        : isFr
                          ? 'Ajoutez un ingrédient pour commander'
                          : 'Add an ingredient to order'}
                </span>
                {canOrder && <ArrowRight size={15} />}
            </button>

            <Modal
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                title={session ? t('ShippingAddress') : ''}
                content={<ShippingAddress handlePayment={handlePayment} isOpen={isOpen} />}
            />
            <Modal
                isOpen={isPaymentOpen}
                setIsOpen={setIsPaymeOpen}
                title={t('Payment')}
                content={
                    <Elements stripe={stripePromise}>
                        <PaymentForm setIsPaymeOpen={setIsPaymeOpen} />
                    </Elements>
                }
            />
        </aside>
    )
}
