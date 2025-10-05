'use client'

import { useState } from 'react'
import { BiDollar } from 'react-icons/bi'
import { useSelector } from 'react-redux'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import clsx from 'clsx'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'

import { selectIngredients } from '@/redux/selectors/ingredients'
import { selectSubstitutions } from '@/redux/selectors/substitutions'
import { RootState } from '@/redux/store'
import { totalFormatter } from '@/utils/utils'

import { CouponInput } from '../coupon'
import { Modal } from '../modal/modal'
import { ShippingAddress } from '../shipping-address'
import { Button, PaymentForm } from '..'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!)

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
        <div className="total-order absolute left-16 top-0 hidden md:block">
            <table>
                <tbody>
                    <tr>
                        <td>{t('Meat')}</td>
                        <td>{meat}</td>
                    </tr>
                    <tr>
                        <td>{t('Salad')}</td>
                        <td>{salad}</td>
                    </tr>
                    <tr>
                        <td>{t('Bacon')}</td>
                        <td>{bacon}</td>
                    </tr>
                    <tr>
                        <td>{t('Cheese')}</td>
                        <td>{cheese}</td>
                    </tr>
                    <tr>
                        <td className="price py-5">{t('Total')}</td>
                        <td className="price flex items-center gap-1 py-5">
                            <span>{totalFormatter.format(totalPrice)}</span> <BiDollar />
                        </td>
                    </tr>
                    {substitutionAdjustment !== 0 && (
                        <tr>
                            <td
                                className={
                                    substitutionAdjustment > 0
                                        ? 'text-orange-600'
                                        : 'text-green-600'
                                }>
                                Substitutions
                            </td>
                            <td
                                className={`${substitutionAdjustment > 0 ? 'text-orange-600' : 'text-green-600'} flex items-center gap-1`}>
                                <span>
                                    {substitutionAdjustment > 0 && '+'}
                                    {totalFormatter.format(substitutionAdjustment)}
                                </span>{' '}
                                <BiDollar />
                            </td>
                        </tr>
                    )}
                    {coupon.isValid && coupon.appliedDiscount > 0 && (
                        <tr>
                            <td className="text-green-600">Discount</td>
                            <td className="text-green-600 flex items-center gap-1">
                                <span>-{totalFormatter.format(coupon.appliedDiscount)}</span>{' '}
                                <BiDollar />
                            </td>
                        </tr>
                    )}
                    {(substitutionAdjustment !== 0 ||
                        (coupon.isValid && coupon.appliedDiscount > 0)) && (
                        <tr>
                            <td className="price py-2 font-bold">Final Total</td>
                            <td className="price flex items-center gap-1 py-2 font-bold">
                                <span>{totalFormatter.format(finalPrice)}</span> <BiDollar />
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            <CouponInput orderTotal={totalPrice} />

            <table>
                <tbody>
                    <tr>
                        <td>
                            <Button
                                label={t('Order')}
                                className={clsx(
                                    'w-20 h-8 mt-4',
                                    finalPrice <= 4 && 'bg-primary-300  hover:bg-primary-300'
                                )}
                                disabled={finalPrice <= 4}
                                onClick={handleOrder}
                            />
                        </td>
                    </tr>
                </tbody>
            </table>
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
