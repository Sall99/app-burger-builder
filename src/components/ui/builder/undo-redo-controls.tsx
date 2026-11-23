'use client'

import { useDispatch, useSelector } from 'react-redux'
import { Redo2, RotateCcw, Undo2 } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { clearBurger, redo, undo } from '@/redux/slices/ingredients-enhanced'
import { RootState } from '@/redux/store'

export function UndoRedoControls() {
    const dispatch = useDispatch()
    const t = useTranslations('Builder')

    const { historyIndex, history, ingredientOrder } = useSelector(
        (state: RootState) => state.rootReducer.ingredients
    )

    const canUndo = historyIndex > 0
    const canRedo = historyIndex < (history?.length ?? 0) - 1
    const hasIngredients = (ingredientOrder?.length ?? 0) > 0

    return (
        <div
            className="inline-flex items-center gap-0.5 rounded-xl border border-zinc-200/80 bg-white p-1 shadow-soft"
            role="toolbar"
            aria-label="Burger history controls">
            <button
                type="button"
                onClick={() => dispatch(undo())}
                disabled={!canUndo}
                className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-zinc-700 transition-colors hover:bg-zinc-100 disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label={t('undo') || 'Undo'}
                title={t('undo') || 'Undo (Ctrl+Z)'}>
                <Undo2 size={14} />
            </button>

            <button
                type="button"
                onClick={() => dispatch(redo())}
                disabled={!canRedo}
                className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-zinc-700 transition-colors hover:bg-zinc-100 disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label={t('redo') || 'Redo'}
                title={t('redo') || 'Redo (Ctrl+Y)'}>
                <Redo2 size={14} />
            </button>

            <div className="mx-0.5 h-3.5 w-px bg-zinc-200" aria-hidden="true" />

            <button
                type="button"
                onClick={() => {
                    if (window.confirm(t('confirmClear') || 'Clear your burger?')) {
                        dispatch(clearBurger())
                    }
                }}
                disabled={!hasIngredients}
                className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label={t('clear') || 'Clear'}
                title={t('clear') || 'Clear burger'}>
                <RotateCcw size={14} />
            </button>
        </div>
    )
}
