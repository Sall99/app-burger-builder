'use client'

import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Download, Save, Trash2 } from 'lucide-react'
import { useTranslations } from 'next-intl'

import type { BurgerTemplate } from '@/redux/slices/ingredients-enhanced'
import { deleteTemplate, loadTemplate, saveTemplate } from '@/redux/slices/ingredients-enhanced'
import { RootState } from '@/redux/store'

export function SavedTemplates() {
    const dispatch = useDispatch()
    const t = useTranslations('Builder')

    const [isOpen, setIsOpen] = useState(false)
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

    const handleLoad = (templateId: string) => {
        dispatch(loadTemplate(templateId))
        setIsOpen(false)
    }

    const handleDelete = (templateId: string, name: string) => {
        if (window.confirm(`Delete "${name}"?`)) {
            dispatch(deleteTemplate(templateId))
        }
    }

    return (
        <div className="mt-4">
            {/* Main Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-4 py-2 bg-primary-200 hover:bg-primary-600 text-white rounded-md transition-colors flex items-center justify-center gap-2">
                <Save size={18} />
                <span>{t('savedTemplates') || 'My Burgers'}</span>
                <span className="ml-auto bg-white text-primary-200 px-2 py-0.5 rounded-full text-xs">
                    {savedTemplates.length}
                </span>
            </button>

            {/* Templates Panel */}
            {isOpen && (
                <div className="mt-2 bg-white border-2 border-gray-200 rounded-lg p-4 shadow-lg">
                    {/* Save Current Burger */}
                    {hasIngredients && (
                        <div className="mb-4 pb-4 border-b">
                            {!showSaveDialog ? (
                                <button
                                    onClick={() => setShowSaveDialog(true)}
                                    className="w-full px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md transition-colors flex items-center justify-center gap-2">
                                    <Save size={18} />
                                    <span>{t('saveCurrentBurger') || 'Save Current Burger'}</span>
                                </button>
                            ) : (
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={templateName}
                                        onChange={(e) => setTemplateName(e.target.value)}
                                        placeholder={t('burgerName') || 'My Awesome Burger'}
                                        className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-400"
                                        maxLength={30}
                                        autoFocus
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') handleSave()
                                            if (e.key === 'Escape') setShowSaveDialog(false)
                                        }}
                                    />
                                    <button
                                        onClick={handleSave}
                                        disabled={!templateName.trim()}
                                        className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                                        {t('save') || 'Save'}
                                    </button>
                                    <button
                                        onClick={() => {
                                            setShowSaveDialog(false)
                                            setTemplateName('')
                                        }}
                                        className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-md transition-colors">
                                        {t('cancel') || 'Cancel'}
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Saved Templates List */}
                    {savedTemplates.length === 0 ? (
                        <div className="text-center text-gray-500 py-8">
                            <Save size={48} className="mx-auto mb-2 opacity-50" />
                            <p>{t('noSavedBurgers') || 'No saved burgers yet'}</p>
                            <p className="text-sm mt-1">
                                {t('createAndSave') || 'Create a burger and save it here!'}
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            <h3 className="font-semibold text-gray-700 mb-2">
                                {t('savedBurgers') || 'Saved Burgers'}
                            </h3>
                            {savedTemplates.map((template: BurgerTemplate) => (
                                <div
                                    key={template.id}
                                    className="template-card flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-all">
                                    <div className="flex-1">
                                        <h4 className="font-medium text-gray-900">
                                            {template.name}
                                        </h4>
                                        <p className="text-xs text-gray-500">
                                            ${template.totalPrice.toFixed(2)} •{' '}
                                            {template.ingredientOrder.length} ingredients
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => handleLoad(template.id)}
                                        className="px-3 py-1.5 bg-primary-200 hover:bg-primary-600 text-white rounded text-sm transition-colors flex items-center gap-1"
                                        title={t('load') || 'Load'}>
                                        <Download size={14} />
                                        <span>{t('load') || 'Load'}</span>
                                    </button>
                                    <button
                                        onClick={() => handleDelete(template.id, template.name)}
                                        className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors"
                                        title={t('delete') || 'Delete'}>
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
