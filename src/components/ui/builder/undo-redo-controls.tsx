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
        <div className="flex gap-2 justify-center mt-4">
            <button
                onClick={() => dispatch(undo())}
                disabled={!canUndo}
                className="undo-redo-button flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                aria-label={t('undo') || 'Undo'}
                title={t('undo') || 'Undo (Ctrl+Z)'}>
                <Undo2 size={18} />
                <span className="hidden sm:inline">{t('undo') || 'Undo'}</span>
            </button>

            <button
                onClick={() => dispatch(redo())}
                disabled={!canRedo}
                className="undo-redo-button flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                aria-label={t('redo') || 'Redo'}
                title={t('redo') || 'Redo (Ctrl+Y)'}>
                <Redo2 size={18} />
                <span className="hidden sm:inline">{t('redo') || 'Redo'}</span>
            </button>

            <button
                onClick={() => {
                    if (window.confirm(t('confirmClear') || 'Clear your burger?')) {
                        dispatch(clearBurger())
                    }
                }}
                disabled={!hasIngredients}
                className="undo-redo-button flex items-center gap-2 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-md disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                aria-label={t('clear') || 'Clear'}
                title={t('clear') || 'Clear burger'}>
                <RotateCcw size={18} />
                <span className="hidden sm:inline">{t('clear') || 'Clear'}</span>
            </button>
        </div>
    )
}
