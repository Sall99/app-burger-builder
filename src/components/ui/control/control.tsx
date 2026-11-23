'use client'

import { useDispatch, useSelector } from 'react-redux'
import { Minus, Plus } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { announce } from '@/lib/accessibility'
import { selectIngredients } from '@/redux/selectors/ingredients'
import { addIngredients, removeIngredients } from '@/redux/slices/ingredients-enhanced'

import { BurgerLayerArt } from '../ingredients/burger-layer-artwork'

const INGREDIENT_META = [
    { label: 'Meat', type: 'meat', kcal: 250 },
    { label: 'Bacon', type: 'bacon', kcal: 120 },
    { label: 'Cheese', type: 'cheese', kcal: 110 },
    { label: 'Salad', type: 'salad', kcal: 15 }
] as const

export const Controls = () => {
    const dispatch = useDispatch()
    const t = useTranslations('Ingredients')
    const { ingredients, prices } = useSelector(selectIngredients)

    const handleAdd = (type: string, label: string) => {
        dispatch(addIngredients(type))
        announce(`Added ${label} to burger`)
    }

    const handleRemove = (type: string, label: string) => {
        dispatch(removeIngredients(type))
        announce(`Removed ${label} from burger`)
    }

    return (
        <div role="region" aria-label="Burger ingredient controls">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {INGREDIENT_META.map((ctrl) => {
                    const count = ingredients?.[ctrl.type] ?? 0
                    const price = prices?.[ctrl.type] ?? 0
                    const translatedLabel = t(`${ctrl.label}`)
                    const active = count > 0

                    return (
                        <div
                            key={ctrl.label}
                            className={`flex flex-col justify-between rounded-xl border bg-white p-3.5 transition-colors ${
                                active
                                    ? 'border-ink'
                                    : 'border-surface-border hover:border-ink/35'
                            }`}>
                            {/* Ingredient Image */}
                            <div className="mb-3 flex h-20 w-full items-center justify-center rounded-lg bg-surface/60 px-4 py-3">
                                <BurgerLayerArt
                                    type={ctrl.type}
                                    className="max-h-12 w-auto max-w-full"
                                />
                            </div>

                            {/* Name + Price */}
                            <div className="flex items-baseline justify-between gap-2">
                                <p
                                    className="font-display text-sm font-bold text-ink truncate"
                                    id={`${ctrl.type}-label`}>
                                    {translatedLabel}
                                </p>
                                <span className="shrink-0 tabular-nums text-xs font-semibold text-ink">
                                    +${price.toFixed(2)}
                                </span>
                            </div>

                            {/* Kcal + Stepper */}
                            <div className="mt-2.5 flex items-center justify-between gap-2">
                                <span className="whitespace-nowrap tabular-nums text-xs text-ink-subtle">
                                    {ctrl.kcal} kcal
                                </span>

                                <div
                                    className="ctrl flex items-center gap-1.5 shrink-0"
                                    role="group"
                                    aria-labelledby={`${ctrl.type}-label`}>
                                    <button
                                        type="button"
                                        onClick={() => handleRemove(ctrl.type, translatedLabel)}
                                        disabled={count === 0}
                                        aria-label={`Remove ${translatedLabel}`}
                                        className="control-button flex h-8 w-8 items-center justify-center rounded-lg border border-surface-border bg-white text-ink transition-colors hover:bg-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-ink disabled:opacity-30 disabled:cursor-not-allowed">
                                        <Minus size={14} aria-hidden="true" />
                                    </button>

                                    <span
                                        className={`min-w-[1.25rem] text-center tabular-nums text-sm font-semibold ${
                                            active ? 'text-ink' : 'text-ink-subtle'
                                        }`}
                                        aria-live="polite">
                                        {count}
                                    </span>

                                    <button
                                        type="button"
                                        onClick={() => handleAdd(ctrl.type, translatedLabel)}
                                        aria-label={`Add ${translatedLabel}`}
                                        className="control-button flex h-8 w-8 items-center justify-center rounded-lg bg-ink text-white transition-colors hover:bg-charcoal-light focus:outline-none focus-visible:ring-2 focus-visible:ring-ink">
                                        <Plus size={14} aria-hidden="true" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
