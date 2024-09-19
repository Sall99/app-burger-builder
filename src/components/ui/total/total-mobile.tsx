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
import { totalFormatter } from '@/utils/utils'

import { Modal } from '../modal/modal'
import { ShippingAddress } from '../shipping-address'
import { Button, PaymentForm } from '..'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!)

export const TotalMobile = () => {
    const session = useSession()
    const t = useTranslations('Total')

    const { ingredients, totalPrice } = useSelector(selectIngredients)
    const [isPaymentOpen, setIsPaymeOpen] = useState(false)
    const { meat, salad, bacon, cheese } = ingredients
    const [isOpen, setIsOpen] = useState(false)

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
        <div className="w-full px-4 py-6 md:hidden text-center text-[#f08e4a] form-card">
            <div className="overflow-x-auto">
                <table className="w-full md:w-auto">
                    <thead>
                        <tr>
                            <th className="px-2 py-2">{t('Meat')}</th>
                            <th className="px-2 py-2">{t('Salad')}</th>
                            <th className="px-2 py-2">{t('Bacon')}</th>
                            <th className="px-2 py-2">{t('Cheese')}</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr>
                            <td className="px-2 py-2 text-center md:text-left">{meat}</td>
                            <td className="px-2 py-2 text-center md:text-left">{salad}</td>
                            <td className="px-2 py-2 text-center md:text-left">{bacon}</td>
                            <td className="px-2 py-2 text-center md:text-left">{cheese}</td>
                        </tr>

                        <tr className="mt-4">
                            <td className="price px-2 py-4 text-lg font-bold md:text-base">
                                {t('Total')}
                            </td>
                            <td
                                colSpan={3}
                                className="price flex items-center justify-center gap-1 px-2 py-4 text-lg font-bold md:text-base">
                                <span>{totalFormatter.format(totalPrice)}</span> <BiDollar />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div className="mt-4 md:mt-0">
                <Button
                    label={t('Order')}
                    className={clsx(
                        'h-12 w-20 md:h-8',
                        totalPrice <= 4 && 'bg-primary-300 hover:bg-primary-300'
                    )}
                    disabled={totalPrice <= 4}
                    onClick={handleOrder}
                />
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
