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
                <UndoRedoControls />

                <section className="flex flex-col items-center px-8 sm:px-16 justify-center relative w-full">
                    <Total />
                    <TotalMobile />

                    <BuilderAnimated ingredients={ingredients} />

                    <div className="w-full max-w-[70rem] mt-20">
                        <Controls />
                    </div>
                </section>
                <section className="px-8 sm:px-16 w-full">
                    <MealDeals />

                    <IngredientSubstitutions />

                    <DeliveryTime />

                    <DietaryInfo />

                    <SavedTemplates />

                    <ShareBurger />
                </section>
            </section>
        </BuilderWrapper>
    )
}
