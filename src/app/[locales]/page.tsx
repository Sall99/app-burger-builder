'use client'

import React from 'react'
import { useSelector } from 'react-redux'

import {
    BuilderAnimated,
    BuilderWrapper,
    Controls,
    DeliveryTime,
    DietaryInfo,
    IngredientSubstitutions,
    MealDeals,
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
                {/* Undo/Redo Controls - Top Position */}
                <UndoRedoControls />

                <section className="flex flex-col items-center px-8 sm:px-16 justify-center relative w-full">
                    <Total />
                    <TotalMobile />

                    {/* Animated Builder with Drag & Drop */}
                    <BuilderAnimated ingredients={ingredients} />

                    {/* Ingredient Controls - Below Builder */}
                    <div className="w-full max-w-4xl mt-8">
                        <Controls />
                    </div>
                </section>
                <section className="px-8 sm:px-16 w-full">
                    {/* Meal Deals */}
                    <MealDeals />

                    {/* Ingredient Substitutions */}
                    <IngredientSubstitutions />

                    {/* Delivery Time Estimation */}
                    <DeliveryTime />

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
