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
        <div className="builder-controls-container">
            <button
                onClick={() => dispatch(undo())}
                disabled={!canUndo}
                className="builder-control-button builder-control-undo"
                aria-label={t('undo') || 'Undo'}
                title={t('undo') || 'Undo (Ctrl+Z)'}>
                <Undo2 size={18} />
                <span className="builder-control-label">{t('undo') || 'Undo'}</span>
            </button>

            <button
                onClick={() => dispatch(redo())}
                disabled={!canRedo}
                className="builder-control-button builder-control-redo"
                aria-label={t('redo') || 'Redo'}
                title={t('redo') || 'Redo (Ctrl+Y)'}>
                <Redo2 size={18} />
                <span className="builder-control-label">{t('redo') || 'Redo'}</span>
            </button>

            <button
                onClick={() => {
                    if (window.confirm(t('confirmClear') || 'Clear your burger?')) {
                        dispatch(clearBurger())
                    }
                }}
                disabled={!hasIngredients}
                className="builder-control-button builder-control-clear"
                aria-label={t('clear') || 'Clear'}
                title={t('clear') || 'Clear burger'}>
                <RotateCcw size={18} />
                <span className="builder-control-label">{t('clear') || 'Clear'}</span>
            </button>
        </div>
    )
}
