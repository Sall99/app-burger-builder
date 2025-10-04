'use client'

import { AiOutlineMinus } from 'react-icons/ai'
import { MdAdd } from 'react-icons/md'
import { useDispatch } from 'react-redux'
import { useTranslations } from 'next-intl'

import { announce } from '@/lib/accessibility'
import { addIngredients, removeIngredients } from '@/redux/slices/ingredients-enhanced'

export const Controls = () => {
    const dispatch = useDispatch()
    const t = useTranslations('Ingredients')

    const controls = [
        { label: 'Meat', type: 'meat' },
        { label: 'Bacon', type: 'bacon' },
        { label: 'Cheese', type: 'cheese' },
        { label: 'Salad', type: 'salad' }
    ]

    const handleAdd = (type: string, label: string) => {
        dispatch(addIngredients(type))
        announce(`Added ${label} to burger`)
    }

    const handleRemove = (type: string, label: string) => {
        dispatch(removeIngredients(type))
        announce(`Removed ${label} from burger`)
    }

    return (
        <div className="build-controls" role="region" aria-label="Burger ingredient controls">
            <div className="controls">
                {controls.map((ctrl) => (
                    <div key={ctrl.label}>
                        <p className="label" id={`${ctrl.type}-label`}>
                            {t(`${ctrl.label}`)}
                        </p>
                        <div className="ctrl" role="group" aria-labelledby={`${ctrl.type}-label`}>
                            <button
                                onClick={() => handleAdd(ctrl.type, t(`${ctrl.label}`))}
                                aria-label={`Add ${t(`${ctrl.label}`)}`}
                                className="control-button focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2">
                                <MdAdd aria-hidden="true" />
                            </button>
                            <button
                                onClick={() => handleRemove(ctrl.type, t(`${ctrl.label}`))}
                                aria-label={`Remove ${t(`${ctrl.label}`)}`}
                                className="control-button focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2">
                                <AiOutlineMinus aria-hidden="true" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
