'use client'
import { useState } from 'react'
import clsx from 'clsx'
import { useSelector } from 'react-redux'
import { BiDollar } from 'react-icons/bi'

import { Button } from '..'
import { selectIngredients } from '@/redux/selectors/ingredients'
import { totalFormatter } from '@/utils/utils'
import { Modal } from '../modal/modal'
import { ShippingAddress } from '../shipping-address'

export const Total = () => {
    const { ingredients, totalPrice } = useSelector(selectIngredients)
    const { meat, salad, bacon, cheese } = ingredients
    let [isOpen, setIsOpen] = useState(false)

    const handleOrder = () => {
        setIsOpen(true)
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
                title="Add your shipping address"
                content={<ShippingAddress />}
            />
        </div>
    )
}
