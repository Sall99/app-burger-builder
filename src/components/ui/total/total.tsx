'use client'
import clsx from 'clsx'
import { BiDollar } from 'react-icons/bi'
import { useSelector } from 'react-redux'
import { Button } from '..'
import { RootState } from '@/redux/store'
import { selectIngredients } from '@/redux/selectors/ingredients'

export const Total = () => {
    const { ingredients, totalPrice } = useSelector(selectIngredients)
    const { meat, salad, bacon, cheese } = ingredients

    console.log('totalPrice', totalPrice)

    const totalFormatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    })

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
                            />
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}
