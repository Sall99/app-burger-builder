'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useTranslations } from 'next-intl'

import { BurgerLayerArt } from './burger-layer-artwork'

interface SortableIngredientProps {
    id: string
    type: string
    zIndex?: number
}

const LAYER_META: Record<string, { className: string; labelKey: string }> = {
    meat: { className: 'Meat', labelKey: 'Meat' },
    cheese: { className: 'Cheese', labelKey: 'Cheese' },
    salad: { className: 'Salad', labelKey: 'Salad' },
    bacon: { className: 'Bacon', labelKey: 'Bacon' }
}

export const SortableBurgerIngredient = ({ id, type, zIndex = 10 }: SortableIngredientProps) => {
    const t = useTranslations('Ingredients')
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id
    })

    const meta = LAYER_META[type]
    if (!meta) return null

    const style: React.CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : zIndex,
        touchAction: 'none'
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={`${meta.className} relative cursor-grab active:cursor-grabbing transition-transform duration-150 ${
                isDragging ? 'scale-105 opacity-95 drop-shadow-2xl' : 'hover:scale-[1.03]'
            }`}
            aria-label={t(meta.labelKey)}>
            <BurgerLayerArt type={type} />
        </div>
    )
}
