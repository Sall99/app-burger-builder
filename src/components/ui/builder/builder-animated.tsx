'use client'

import { FC, useEffect, useMemo, useState } from 'react'
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
import { Box, GripVertical, Image as ImageIcon, Loader2 } from 'lucide-react'
import dynamic from 'next/dynamic'
import { useLocale, useTranslations } from 'next-intl'

import {
    clearLastAction,
    reorderIngredients,
    setIngredients
} from '@/redux/slices/ingredients-enhanced'
import { RootState } from '@/redux/store'
import { BuilderProps } from '@/types'
import { calculateDeliveryTime, getDeliveryTimeRange } from '@/utils/delivery-time-calculator'
import { calculateBurgerDietaryInfo } from '@/utils/dietary-calculator'

import { BurgerIngredients } from '../ingredients'
import { SortableBurgerIngredient } from '../ingredients/ingredients-sortable'

import { UndoRedoControls } from './undo-redo-controls'

const Burger3DCanvas = dynamic(() => import('./burger-3d-canvas'), {
    ssr: false,
    loading: () => (
        <div className="flex min-h-[370px] w-full items-center justify-center bg-surface/40">
            <Loader2 className="h-6 w-6 animate-spin text-ink-subtle" />
        </div>
    )
})

const QUICK_PRESETS = [
    {
        id: 'classic',
        labelEn: 'Classic',
        labelFr: 'Classique',
        ingredients: { meat: 1, cheese: 1, salad: 1, bacon: 0 }
    },
    {
        id: 'double',
        labelEn: 'Double Melt',
        labelFr: 'Double Cheddar',
        ingredients: { meat: 2, cheese: 2, salad: 1, bacon: 0 }
    },
    {
        id: 'smokehouse',
        labelEn: 'Smoky Bacon',
        labelFr: 'Smoky Bacon',
        ingredients: { meat: 2, cheese: 2, bacon: 2, salad: 1 }
    }
] as const

export const BuilderAnimated: FC<BuilderProps> = ({ ingredients }) => {
    const t = useTranslations('Builder')
    const locale = useLocale()
    const isFr = locale === 'fr'
    const dispatch = useDispatch()
    const ingredientOrder = useSelector(
        (state: RootState) => state.rootReducer.ingredients.ingredientOrder || []
    )
    const lastAction = useSelector((state: RootState) => state.rootReducer.ingredients.lastAction)

    const [animatingIngredients, setAnimatingIngredients] = useState<string[]>([])
    const [viewMode, setViewMode] = useState<'2d' | '3d'>('3d')

    const dietaryInfo = useMemo(
        () => calculateBurgerDietaryInfo(ingredients as Record<string, number>),
        [ingredients]
    )

    const timeRange = useMemo(() => {
        const est = calculateDeliveryTime(ingredients as Record<string, number>, { distance: 5 })
        return getDeliveryTimeRange(est.totalTime)
    }, [ingredients])

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 4
            }
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates
        })
    )

    useEffect(() => {
        if (lastAction === 'add' && ingredientOrder.length > 0) {
            const lastIngredient = ingredientOrder[ingredientOrder.length - 1]
            setAnimatingIngredients((prev) => [...prev, lastIngredient.id])

            const timer = setTimeout(() => {
                setAnimatingIngredients((prev) => prev.filter((id) => id !== lastIngredient.id))
                dispatch(clearLastAction())
            }, 450)
            return () => clearTimeout(timer)
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
                      return [...Array(ingredients[igkey])].map((_, i) => ({
                          id: `${igkey}-${i}`,
                          type: igkey
                      }))
                  })
                  .reduce((arr, currVal) => arr.concat(currVal), [])

    const layerLabel = isFr
        ? arrayIngredients.length > 1
            ? 'couches'
            : 'couche'
        : arrayIngredients.length === 1
          ? 'layer'
          : 'layers'

    return (
        <div className="overflow-hidden rounded-xl border border-surface-border bg-white">
            {/* Top Bar: Metrics + 2D/3D Switcher + Undo/Redo */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-surface-border px-4 py-3">
                <div className="flex flex-wrap items-center gap-2 text-xs text-ink-muted tabular-nums">
                    <span className="font-semibold text-ink">
                        {arrayIngredients.length} {layerLabel}
                    </span>
                    <span>·</span>
                    <span>{dietaryInfo.totalNutrition.calories} kcal</span>
                    <span>·</span>
                    <span>
                        {timeRange.min}–{timeRange.max} min
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    {/* 2D Studio / 3D 360 Switcher */}
                    <div
                        role="group"
                        aria-label="Burger view mode"
                        className="inline-flex rounded-lg border border-surface-border bg-surface p-0.5 text-xs">
                        <button
                            type="button"
                            onClick={() => setViewMode('3d')}
                            className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 font-semibold transition-colors ${
                                viewMode === '3d'
                                    ? 'bg-ink text-white'
                                    : 'text-ink-muted hover:text-ink'
                            }`}>
                            <Box size={12} />
                            <span>3D 360°</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setViewMode('2d')}
                            className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 font-semibold transition-colors ${
                                viewMode === '2d'
                                    ? 'bg-ink text-white'
                                    : 'text-ink-muted hover:text-ink'
                            }`}>
                            <ImageIcon size={12} />
                            <span>{isFr ? 'Photo 2D' : '2D Photo'}</span>
                        </button>
                    </div>

                    <UndoRedoControls />
                </div>
            </div>

            {/* Center Burger Stage: 3D WebGL or 2D Draggable Stack */}
            {viewMode === '3d' ? (
                <Burger3DCanvas layers={arrayIngredients} isFr={isFr} />
            ) : (
                <div className="flex flex-col items-center justify-center bg-surface/40 px-4 py-8 sm:py-10 min-h-[370px]">
                    <div className="burger-builder">
                        <BurgerIngredients type="BreadTop" />

                        {arrayIngredients.length === 0 ? (
                            <div className="relative z-20 my-10 rounded-lg border border-dashed border-surface-border bg-white px-5 py-3 text-center">
                                <p className="text-xs font-semibold text-ink">
                                    {t('AddIngredients')}
                                </p>
                                <p className="mt-0.5 text-[11px] text-ink-muted">
                                    {isFr
                                        ? 'Sélectionnez vos garnitures à droite'
                                        : 'Select toppings on the right'}
                                </p>
                            </div>
                        ) : (
                            <DndContext
                                sensors={sensors}
                                collisionDetection={closestCenter}
                                onDragEnd={handleDragEnd}>
                                <SortableContext
                                    items={arrayIngredients.map((item) => item.id)}
                                    strategy={verticalListSortingStrategy}>
                                    {arrayIngredients.map((item, idx) => (
                                        <div
                                            key={item.id}
                                            style={{ zIndex: 35 - idx }}
                                            className={`relative ${
                                                animatingIngredients.includes(item.id)
                                                    ? 'ingredient-enter'
                                                    : ''
                                            }`}>
                                            <SortableBurgerIngredient
                                                id={item.id}
                                                type={item.type}
                                                zIndex={35 - idx}
                                            />
                                        </div>
                                    ))}
                                </SortableContext>
                            </DndContext>
                        )}

                        <BurgerIngredients type="BreadBottom" />
                    </div>

                    <div
                        aria-hidden="true"
                        className="-mt-2 h-4 w-56 rounded-[100%] bg-ink/10 blur-md"
                    />

                    {arrayIngredients.length > 1 && (
                        <p className="mt-4 inline-flex items-center gap-1 text-[11px] text-ink-subtle">
                            <GripVertical size={12} />
                            {isFr
                                ? 'Glissez une couche pour réorganiser'
                                : 'Drag any layer to reorder'}
                        </p>
                    )}
                </div>
            )}

            {/* Bottom Preset Strip */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-surface-border bg-white px-4 py-2.5">
                <span className="text-xs text-ink-subtle">
                    {isFr ? 'Bases rapides' : 'Quick bases'}
                </span>
                <div className="flex flex-wrap items-center gap-1.5">
                    {QUICK_PRESETS.map((preset) => (
                        <button
                            key={preset.id}
                            type="button"
                            onClick={() => dispatch(setIngredients(preset.ingredients))}
                            className="rounded-md border border-surface-border bg-surface/70 px-2.5 py-1 text-xs font-medium text-ink transition-colors hover:bg-surface">
                            {isFr ? preset.labelFr : preset.labelEn}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}
