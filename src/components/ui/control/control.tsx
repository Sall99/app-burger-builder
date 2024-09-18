'use client'

import { AiOutlineMinus } from 'react-icons/ai'
import { MdAdd } from 'react-icons/md'
import { useDispatch } from 'react-redux'
import { useTranslations } from 'next-intl'

import { addIngredients, removeIngredients } from '@/redux/slices/ingredients'

export const Controls = () => {
    const dispatch = useDispatch()
    const t = useTranslations('Ingredients')

    const controls = [
        { label: 'Meat', type: 'meat' },
        { label: 'Bacon', type: 'bacon' },
        { label: 'Cheese', type: 'cheese' },
        { label: 'Salad', type: 'salad' }
    ]

    return (
        <div className="build-controls">
            <div className="controls">
                {controls.map((ctrl) => (
                    <div key={ctrl.label}>
                        <p className="label">{t(`${ctrl.label}`)}</p>
                        <div className="ctrl">
                            <div onClick={() => dispatch(addIngredients(ctrl.type))}>
                                <MdAdd />
                            </div>
                            <div onClick={() => dispatch(removeIngredients(ctrl.type))}>
                                <AiOutlineMinus />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
