'use client'
import { useState } from 'react'
import { BiDollar } from 'react-icons/bi'
import { useSelector } from 'react-redux'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import clsx from 'clsx'
import { useSession } from 'next-auth/react'

import { selectIngredients } from '@/redux/selectors/ingredients'
import { totalFormatter } from '@/utils/utils'

import { Modal } from '../modal/modal'
import { ShippingAddress } from '../shipping-address'
import { Button, PaymentForm } from '..'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!)

export const Total = () => {
    const session = useSession()

    const { ingredients, totalPrice } = useSelector(selectIngredients)
    const [isPaymentOpen, setIsPaymeOpen] = useState(false)
    const { meat, salad, bacon, cheese } = ingredients
    const [isOpen, setIsOpen] = useState(false)

    const handleOrder = () => {
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
                        <td>Meat</td>
                        <td>{meat}</td>
                    </tr>
                    <tr>
                        <td>Salad</td>
                        <td>{salad}</td>
                    </tr>
                    <tr>
                        <td>Bacon</td>
                        <td>{bacon}</td>
                    </tr>
                    <tr>
                        <td>Cheese</td>
                        <td>{cheese}</td>
                    </tr>
                    <tr>
                        <td className="price py-5">Total</td>
                        <td className="price flex items-center gap-1 py-5">
                            <span>{totalFormatter.format(totalPrice)}</span> <BiDollar />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <Button
                                label="Order"
                                className={clsx(
                                    'w-20 h-8',
                                    totalPrice <= 4 && 'bg-primary-300  hover:bg-primary-300'
                                )}
                                disabled={totalPrice <= 4}
                                onClick={handleOrder}
                            />
                        </td>
                    </tr>
                </tbody>
            </table>
            <Modal
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                title={session ? 'Shipping Address' : ''}
                content={<ShippingAddress handlePayment={handlePayment} isOpen={isOpen} />}
            />
            <Modal
                isOpen={isPaymentOpen}
                setIsOpen={setIsPaymeOpen}
                title="Payment"
                content={
                    <Elements stripe={stripePromise}>
                        <PaymentForm setIsPaymeOpen={setIsPaymeOpen} />
                    </Elements>
                }
            />
        </div>
    )
}
