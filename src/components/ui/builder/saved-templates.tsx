'use client'

import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Bookmark, Download, Save, Trash2 } from 'lucide-react'
import { useTranslations } from 'next-intl'

import type { BurgerTemplate } from '@/redux/slices/ingredients-enhanced'
import { deleteTemplate, loadTemplate, saveTemplate } from '@/redux/slices/ingredients-enhanced'
import { RootState } from '@/redux/store'

export function SavedTemplates() {
    const dispatch = useDispatch()
    const t = useTranslations('Builder')

    const [templateName, setTemplateName] = useState('')
    const [showSaveDialog, setShowSaveDialog] = useState(false)

    const savedTemplates = useSelector(
        (state: RootState) => state.rootReducer.ingredients.savedTemplates || []
    )
    const hasIngredients = useSelector(
        (state: RootState) => (state.rootReducer.ingredients.ingredientOrder?.length ?? 0) > 0
    )

    const handleSave = () => {
        if (templateName.trim()) {
            dispatch(saveTemplate(templateName.trim()))
            setTemplateName('')
            setShowSaveDialog(false)
        }
    }

    const handleDelete = (templateId: string, name: string) => {
        if (window.confirm(`Delete "${name}"?`)) {
            dispatch(deleteTemplate(templateId))
        }
    }

    return (
        <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 space-y-4">
            <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                    <Bookmark size={15} className="text-zinc-500" />
                    <h3 className="text-sm font-semibold text-zinc-950">
                        {t('savedTemplates') || 'Saved Burgers'}
                    </h3>
                </div>
                {hasIngredients && !showSaveDialog && (
                    <button
                        type="button"
                        onClick={() => setShowSaveDialog(true)}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-950 px-3 py-1.5 text-xs font-medium text-white hover:bg-zinc-800">
                        <Save size={13} />
                        <span>{t('save') || 'Save'}</span>
                    </button>
                )}
            </div>

            {showSaveDialog && (
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        value={templateName}
                        onChange={(e) => setTemplateName(e.target.value)}
                        placeholder={t('burgerName') || 'My Burger'}
                        className="flex-1 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs text-zinc-950 focus:border-zinc-950 focus:bg-white focus:outline-none"
                        maxLength={30}
                        autoFocus
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSave()
                            if (e.key === 'Escape') setShowSaveDialog(false)
                        }}
                    />
                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={!templateName.trim()}
                        className="rounded-xl bg-zinc-950 px-3.5 py-2 text-xs font-semibold text-white disabled:opacity-40">
                        {t('save') || 'Save'}
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            setShowSaveDialog(false)
                            setTemplateName('')
                        }}
                        className="rounded-xl border border-zinc-200 px-3 py-2 text-xs font-medium text-zinc-600 hover:bg-zinc-50">
                        {t('cancel') || 'Cancel'}
                    </button>
                </div>
            )}

            {savedTemplates.length === 0 ? (
                <p className="rounded-xl border border-dashed border-zinc-200 py-6 text-center text-xs text-zinc-500">
                    {t('noSavedBurgers') || 'No saved burgers yet'}
                </p>
            ) : (
                <div className="divide-y divide-zinc-100 rounded-xl border border-zinc-100 overflow-hidden">
                    {savedTemplates.map((template: BurgerTemplate) => (
                        <div
                            key={template.id}
                            className="flex items-center justify-between gap-3 px-3.5 py-2.5 hover:bg-zinc-50">
                            <div className="min-w-0">
                                <p className="truncate text-xs font-semibold text-zinc-950">
                                    {template.name}
                                </p>
                                <p className="text-[11px] text-zinc-500">
                                    ${template.totalPrice.toFixed(2)} ·{' '}
                                    {template.ingredientOrder.length}
                                </p>
                            </div>
                            <div className="flex items-center gap-1">
                                <button
                                    type="button"
                                    onClick={() => dispatch(loadTemplate(template.id))}
                                    className="inline-flex items-center gap-1 rounded-lg border border-zinc-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-zinc-800 hover:border-zinc-950">
                                    <Download size={12} />
                                    <span>{t('load') || 'Load'}</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleDelete(template.id, template.name)}
                                    className="rounded-lg p-1.5 text-zinc-400 hover:bg-red-50 hover:text-red-600"
                                    aria-label={t('delete') || 'Delete'}>
                                    <Trash2 size={13} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
