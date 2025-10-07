'use client'

import { useState } from 'react'
import { BiDollar, BiReceipt } from 'react-icons/bi'
import { useSelector } from 'react-redux'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { ShoppingCart } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'

import { selectIngredients } from '@/redux/selectors/ingredients'
import { selectSubstitutions } from '@/redux/selectors/substitutions'
import { RootState } from '@/redux/store'
import { totalFormatter } from '@/utils/utils'

import { CouponInput } from '../coupon'
import { Modal } from '../modal/modal'
import { ShippingAddress } from '../shipping-address'
import { PaymentForm } from '..'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!)

export const TotalMobile = () => {
    const session = useSession()
    const t = useTranslations('Total')

    const { ingredients, totalPrice } = useSelector(selectIngredients)
    const coupon = useSelector((state: RootState) => state.rootReducer.coupon)
    const { totalAdjustment: substitutionAdjustment } = useSelector(selectSubstitutions)
    const [isPaymentOpen, setIsPaymeOpen] = useState(false)
    const { meat, salad, bacon, cheese } = ingredients
    const [isOpen, setIsOpen] = useState(false)

    const priceAfterSubstitutions = totalPrice + substitutionAdjustment
    const finalPrice = priceAfterSubstitutions - (coupon.appliedDiscount || 0)

    const handleOrder = () => {
        if (typeof window !== 'undefined' && window.dataLayer) {
            window.dataLayer.push({
                event: 'orderInitiated',
                orderDetails: {
                    meat,
                    salad,
                    bacon,
                    cheese,
                    totalPrice
                }
            })
        }
        setIsOpen(true)
    }

    const handlePayment = () => {
        setIsOpen(false)
        setIsPaymeOpen(true)
    }

    return (
        <div className="total-card-mobile">
            <div className="total-card-mobile-header">
                <BiReceipt className="total-card-mobile-icon" />
                <h3 className="total-card-mobile-title">{t('OrderSummary') || 'Order Summary'}</h3>
            </div>

            <div className="total-mobile-grid">
                <div className="total-mobile-grid-item">
                    <span className="total-mobile-label">{t('Meat')}</span>
                    <span className="total-mobile-value">{meat}</span>
                </div>
                <div className="total-mobile-grid-item">
                    <span className="total-mobile-label">{t('Salad')}</span>
                    <span className="total-mobile-value">{salad}</span>
                </div>
                <div className="total-mobile-grid-item">
                    <span className="total-mobile-label">{t('Bacon')}</span>
                    <span className="total-mobile-value">{bacon}</span>
                </div>
                <div className="total-mobile-grid-item">
                    <span className="total-mobile-label">{t('Cheese')}</span>
                    <span className="total-mobile-value">{cheese}</span>
                </div>
            </div>

            <div className="total-mobile-summary">
                <div className="total-mobile-row">
                    <span className="total-mobile-summary-label">{t('Subtotal')}</span>
                    <div className="total-mobile-summary-value">
                        <span>{totalFormatter.format(totalPrice)}</span>
                        <BiDollar />
                    </div>
                </div>

                {substitutionAdjustment !== 0 && (
                    <div
                        className={`total-mobile-row ${substitutionAdjustment > 0 ? 'total-mobile-adjustment-positive' : 'total-mobile-adjustment-negative'}`}>
                        <span>{t('Substitutions') || 'Substitutions'}</span>
                        <div className="total-mobile-summary-value">
                            <span>
                                {substitutionAdjustment > 0 && '+'}
                                {totalFormatter.format(substitutionAdjustment)}
                            </span>
                            <BiDollar />
                        </div>
                    </div>
                )}

                {coupon.isValid && coupon.appliedDiscount > 0 && (
                    <div className="total-mobile-row total-mobile-discount">
                        <span>{t('Discount') || 'Discount'}</span>
                        <div className="total-mobile-summary-value">
                            <span>-{totalFormatter.format(coupon.appliedDiscount)}</span>
                            <BiDollar />
                        </div>
                    </div>
                )}

                <div className="total-mobile-coupon">
                    <CouponInput orderTotal={totalPrice} />
                </div>

                <div className="total-mobile-row total-mobile-final">
                    <span className="total-mobile-final-label">{t('Total')}</span>
                    <div className="total-mobile-final-value">
                        <span>{totalFormatter.format(finalPrice)}</span>
                        <BiDollar />
                    </div>
                </div>
            </div>

            <button
                onClick={handleOrder}
                disabled={finalPrice <= 4}
                className="total-mobile-button">
                <ShoppingCart size={20} />
                <span>{t('Order')}</span>
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
        </div>
    )
}
