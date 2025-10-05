'use client'

import React from 'react'
import { useSelector } from 'react-redux'

import {
    BuilderAnimated,
    BuilderWrapper,
    Controls,
    DietaryInfo,
    SavedTemplates,
    ShareBurger,
    UndoRedoControls
} from '@/components/ui'
import { Total } from '@/components/ui/total/total'
import { TotalMobile } from '@/components/ui/total/total-mobile'
import { selectIngredients } from '@/redux/selectors/ingredients'

export default function Home() {
    const { ingredients } = useSelector(selectIngredients)

    return (
        <BuilderWrapper>
            <section className="flex min-h-screen flex-col items-center pt-8">
                <section className="flex flex-col items-center px-8 sm:px-16 justify-center relative w-full">
                    <Total />
                    <TotalMobile />

                    {/* Undo/Redo Controls */}
                    <UndoRedoControls />

                    {/* Animated Builder with Drag & Drop */}
                    <BuilderAnimated ingredients={ingredients} />
                </section>
                <section className="px-8 sm:px-16 w-full">
                    {/* Ingredient Controls */}
                    <Controls />

                    {/* Dietary Information */}
                    <DietaryInfo />

                    {/* Saved Templates */}
                    <SavedTemplates />

                    {/* Share Burger */}
                    <ShareBurger />
                </section>
            </section>
        </BuilderWrapper>
    )
}
