'use client'
import { useDispatch } from 'react-redux'
import { MdAdd } from 'react-icons/md'
import { AiOutlineMinus } from 'react-icons/ai'
import { addIngredients, removeIngredients } from '@/redux/slices/ingredients'

export const Controls = () => {
    const dispatch = useDispatch()
    const controls = [
        { label: 'Meat', type: 'meat' },
        { label: 'Bacon', type: 'bacon' },
        { label: 'Cheese', type: 'cheese' },
        { label: 'Salad', type: 'salad' }
    ]

    return (
        <div className="build-controls">
            <div className="controls">
                {controls.map((ctrl) => {
                    return (
                        <div key={ctrl.label}>
                            <p className="label">{ctrl.label}</p>
                            <div className="ctrl">
                                <div onClick={() => dispatch(addIngredients(ctrl.type))}>
                                    <MdAdd />
                                </div>
                                <div onClick={() => dispatch(removeIngredients(ctrl.type))}>
                                    <AiOutlineMinus />
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
