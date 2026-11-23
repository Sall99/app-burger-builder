'use client'

import { useState } from 'react'
import { useSelector } from 'react-redux'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { ArrowRight } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useLocale, useTranslations } from 'next-intl'

import { selectIngredients } from '@/redux/selectors/ingredients'
import { selectSubstitutions } from '@/redux/selectors/substitutions'
import { RootState } from '@/redux/store'
import { totalFormatter } from '@/utils/utils'

import { Modal } from '../modal/modal'
import { ShippingAddress } from '../shipping-address'
import { PaymentForm } from '..'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export const TotalMobile = () => {
    const session = useSession()
    const t = useTranslations('Total')
    const locale = useLocale()
    const isFr = locale === 'fr'

    const { ingredients, totalPrice } = useSelector(selectIngredients)
    const coupon = useSelector((state: RootState) => state.rootReducer.coupon)
    const { totalAdjustment: substitutionAdjustment } = useSelector(selectSubstitutions)
    const [isPaymentOpen, setIsPaymeOpen] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const { meat, salad, bacon, cheese } = ingredients

    const priceAfterSubstitutions = totalPrice + substitutionAdjustment
    const finalPrice = Math.max(0, priceAfterSubstitutions - (coupon.appliedDiscount || 0))
    const totalCount = meat + salad + bacon + cheese
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
        <>
            <div className="fixed inset-x-0 bottom-0 z-30 border-t border-surface-border bg-white/95 px-4 py-3 shadow-elevated backdrop-blur-xl lg:hidden">
                <div className="mx-auto flex max-w-xl items-center justify-between gap-4">
                    <div>
                        <p className="tabular-nums text-[11px] font-semibold text-ink-muted">
                            {totalCount}{' '}
                            {isFr
                                ? totalCount > 1
                                    ? 'couches'
                                    : 'couche'
                                : totalCount === 1
                                  ? 'layer'
                                  : 'layers'}
                        </p>
                        <p className="tabular-nums text-xl font-bold tracking-tight tabular-nums text-ink">
                            {totalFormatter.format(finalPrice)}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={handleOrder}
                        disabled={!canOrder}
                        className="inline-flex items-center gap-2 rounded-full bg-brand-500 px-6 py-3 font-display text-sm font-bold text-white hover:bg-brand-600 active:scale-[0.98] disabled:bg-surface-muted disabled:text-ink-subtle disabled:shadow-none">
                        <span>{t('Order')}</span>
                        <ArrowRight size={15} strokeWidth={2.5} />
                    </button>
                </div>
            </div>

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
        </>
    )
}
