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

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export const Total = () => {
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
        <div className="total-card-container">
            <div className="total-card-header">
                <BiReceipt className="total-card-icon" aria-hidden="true" />
                <h3 className="total-card-title">{t('OrderSummary') || 'Order Summary'}</h3>
            </div>

            <div className="total-card-content">
                <div className="total-ingredients-list">
                    <div className="total-ingredient-row">
                        <span className="total-ingredient-label">{t('Meat')}</span>
                        <span className="total-ingredient-value">{meat}</span>
                    </div>
                    <div className="total-ingredient-row">
                        <span className="total-ingredient-label">{t('Salad')}</span>
                        <span className="total-ingredient-value">{salad}</span>
                    </div>
                    <div className="total-ingredient-row">
                        <span className="total-ingredient-label">{t('Bacon')}</span>
                        <span className="total-ingredient-value">{bacon}</span>
                    </div>
                    <div className="total-ingredient-row">
                        <span className="total-ingredient-label">{t('Cheese')}</span>
                        <span className="total-ingredient-value">{cheese}</span>
                    </div>
                </div>

                <div className="total-price-row total-subtotal">
                    <span className="total-price-label">{t('Subtotal')}</span>
                    <div className="total-price-value">
                        <span>{totalFormatter.format(totalPrice)}</span>
                        <BiDollar />
                    </div>
                </div>

                {substitutionAdjustment !== 0 && (
                    <div
                        className={`total-price-row ${substitutionAdjustment > 0 ? 'total-adjustment-positive' : 'total-adjustment-negative'}`}>
                        <span className="total-adjustment-label">
                            {t('Substitutions') || 'Substitutions'}
                        </span>
                        <div className="total-adjustment-value">
                            <span>
                                {substitutionAdjustment > 0 && '+'}
                                {totalFormatter.format(substitutionAdjustment)}
                            </span>
                            <BiDollar />
                        </div>
                    </div>
                )}

                {coupon.isValid && coupon.appliedDiscount > 0 && (
                    <div className="total-price-row total-discount">
                        <span className="total-discount-label">{t('Discount') || 'Discount'}</span>
                        <div className="total-discount-value">
                            <span>-{totalFormatter.format(coupon.appliedDiscount)}</span>
                            <BiDollar />
                        </div>
                    </div>
                )}

                <div className="total-coupon-section">
                    <CouponInput orderTotal={totalPrice} />
                </div>

                <div className="total-price-row total-final">
                    <span className="total-final-label">{t('Total')}</span>
                    <div className="total-final-value">
                        <span>{totalFormatter.format(finalPrice)}</span>
                        <BiDollar />
                    </div>
                </div>

                <button
                    onClick={handleOrder}
                    disabled={finalPrice <= 4}
                    className="total-order-button">
                    <ShoppingCart size={18} />
                    <span>{t('Order')}</span>
                </button>
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
        </div>
    )
}
