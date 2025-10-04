'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useTranslations } from 'next-intl'

interface SortableIngredientProps {
    id: string
    type: string
}

export const SortableBurgerIngredient = ({ id, type }: SortableIngredientProps) => {
    const t = useTranslations('Ingredients')
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id
    })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.8 : 1,
        touchAction: 'none'
    }

    // Generate the appropriate ingredient div based on type
    const getIngredientElement = () => {
        switch (type) {
            case 'meat':
                return (
                    <div
                        ref={setNodeRef}
                        style={style}
                        {...attributes}
                        {...listeners}
                        className="Meat"
                        aria-label={t('Meat')}
                    />
                )
            case 'cheese':
                return (
                    <div
                        ref={setNodeRef}
                        style={style}
                        {...attributes}
                        {...listeners}
                        className="Cheese"
                        aria-label={t('Cheese')}
                    />
                )
            case 'salad':
                return (
                    <div
                        ref={setNodeRef}
                        style={style}
                        {...attributes}
                        {...listeners}
                        className="Salad"
                        aria-label={t('Salad')}
                    />
                )
            case 'bacon':
                return (
                    <div
                        ref={setNodeRef}
                        style={style}
                        {...attributes}
                        {...listeners}
                        className="Bacon"
                        aria-label={t('Bacon')}
                    />
                )
            default:
                return null
        }
    }

    return getIngredientElement()
}
