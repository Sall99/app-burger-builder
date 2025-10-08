'use client'

import { useState } from 'react'
import { BiBookmark } from 'react-icons/bi'
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
        <div className="saved-templates-container">
            <div className="saved-templates-header" onClick={() => setIsOpen(!isOpen)}>
                <BiBookmark className="saved-templates-icon" aria-hidden="true" />
                <div className="saved-templates-title-wrapper">
                    <h3 className="saved-templates-title">
                        {t('savedTemplates') || 'My Saved Burgers'}
                    </h3>
                    <p className="saved-templates-subtitle">
                        {t('savedSubtitle') ||
                            `${savedTemplates.length} ${savedTemplates.length === 1 ? 'burger' : 'burgers'} saved`}
                    </p>
                </div>
                <span className="saved-templates-arrow">{isOpen ? '▼' : '▶'}</span>
            </div>

            {isOpen && (
                <div className="saved-templates-content">
                    {hasIngredients && (
                        <div className="save-current-section">
                            {!showSaveDialog ? (
                                <button
                                    onClick={() => setShowSaveDialog(true)}
                                    className="save-current-button">
                                    <Save size={18} />
                                    <span>{t('saveCurrentBurger') || 'Save Current Burger'}</span>
                                </button>
                            ) : (
                                <div className="save-dialog">
                                    <input
                                        type="text"
                                        value={templateName}
                                        onChange={(e) => setTemplateName(e.target.value)}
                                        placeholder={t('burgerName') || 'My Awesome Burger'}
                                        className="save-input"
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
                                        className="save-confirm-button">
                                        {t('save') || 'Save'}
                                    </button>
                                    <button
                                        onClick={() => {
                                            setShowSaveDialog(false)
                                            setTemplateName('')
                                        }}
                                        className="save-cancel-button">
                                        {t('cancel') || 'Cancel'}
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {savedTemplates.length === 0 ? (
                        <div className="templates-empty-state">
                            <Save size={48} className="templates-empty-icon" />
                            <p className="templates-empty-title">
                                {t('noSavedBurgers') || 'No saved burgers yet'}
                            </p>
                            <p className="templates-empty-subtitle">
                                {t('createAndSave') || 'Create a burger and save it here!'}
                            </p>
                        </div>
                    ) : (
                        <div className="templates-list">
                            <h4 className="templates-list-title">
                                {t('savedBurgers') || 'Your Saved Burgers'}
                            </h4>
                            {savedTemplates.map((template: BurgerTemplate) => (
                                <div key={template.id} className="template-card">
                                    <div className="template-info">
                                        <h5 className="template-name">{template.name}</h5>
                                        <p className="template-details">
                                            ${template.totalPrice.toFixed(2)} •{' '}
                                            {template.ingredientOrder.length} ingredients
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => handleLoad(template.id)}
                                        className="template-load-button"
                                        title={t('load') || 'Load'}>
                                        <Download size={16} />
                                        <span>{t('load') || 'Load'}</span>
                                    </button>
                                    <button
                                        onClick={() => handleDelete(template.id, template.name)}
                                        className="template-delete-button"
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
