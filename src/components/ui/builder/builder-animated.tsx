'use client'

import { FC, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
    closestCenter,
    DndContext,
    DragEndEvent,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors
} from '@dnd-kit/core'
import {
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy
} from '@dnd-kit/sortable'
import Image from 'next/image'
import { useTranslations } from 'next-intl'

import { clearLastAction, reorderIngredients } from '@/redux/slices/ingredients-enhanced'
import { RootState } from '@/redux/store'
import { BuilderProps } from '@/types'

import { BurgerIngredients } from '../ingredients'
import { SortableBurgerIngredient } from '../ingredients/ingredients-sortable'

export const BuilderAnimated: FC<BuilderProps> = ({ ingredients }) => {
    const t = useTranslations('Builder')
    const dispatch = useDispatch()
    const ingredientOrder = useSelector(
        (state: RootState) => state.rootReducer.ingredients.ingredientOrder || []
    )
    const lastAction = useSelector((state: RootState) => state.rootReducer.ingredients.lastAction)

    const [animatingIngredients, setAnimatingIngredients] = useState<string[]>([])

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates
        })
    )

    useEffect(() => {
        if (lastAction === 'add' && ingredientOrder.length > 0) {
            const lastIngredient = ingredientOrder[ingredientOrder.length - 1]
            setAnimatingIngredients((prev) => [...prev, lastIngredient.id])

            setTimeout(() => {
                setAnimatingIngredients((prev) => prev.filter((id) => id !== lastIngredient.id))
                dispatch(clearLastAction())
            }, 500)
        }
    }, [ingredientOrder, lastAction, dispatch])

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event

        if (over && active.id !== over.id) {
            const oldIndex = ingredientOrder.findIndex((item) => item.id === active.id)
            const newIndex = ingredientOrder.findIndex((item) => item.id === over.id)

            if (oldIndex !== -1 && newIndex !== -1) {
                dispatch(reorderIngredients({ fromIndex: oldIndex, toIndex: newIndex }))
            }
        }
    }

    const arrayIngredients =
        ingredientOrder.length > 0
            ? ingredientOrder.map((item) => item)
            : Object.keys(ingredients)
                  .map((igkey) => {
                      return [...Array(ingredients[igkey])].map((a, i) => ({
                          id: `${igkey}-${i}`,
                          type: igkey
                      }))
                  })
                  .reduce((arr, currVal) => arr.concat(currVal), [])

    return (
        <div className="burger-builder mt-16 sm:mt-1">
            <BurgerIngredients type="BreadTop" />

            {arrayIngredients.length === 0 && (
                <div className="flex items-center flex-col">
                    <div className="w-20 h-20 relative">
                        <Image
                            src="/images/burger-empy.png"
                            alt="Empty burger"
                            fill
                            priority
                            sizes="(max-width: 640px) 100vw, 640px"
                        />
                    </div>
                    <h2 className="text-primary-200 mt-1">{t('AddIngredients')}</h2>
                </div>
            )}

            {arrayIngredients.length > 0 && (
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}>
                    <SortableContext
                        items={arrayIngredients.map((item) => item.id)}
                        strategy={verticalListSortingStrategy}>
                        {arrayIngredients.map((item) => (
                            <SortableBurgerIngredient key={item.id} id={item.id} type={item.type} />
                        ))}
                    </SortableContext>
                </DndContext>
            )}

            <BurgerIngredients type="BreadBottom" />
        </div>
    )
}
