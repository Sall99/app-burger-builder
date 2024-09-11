'use client'

import React from 'react'
import { useSelector } from 'react-redux'

import { Builder, Controls, Total } from '@/components/ui'
import { selectIngredients } from '@/redux/selectors/ingredients'

export default function Home() {
    const { ingredients } = useSelector(selectIngredients)

    return (
        <section className="flex min-h-screen flex-col items-center pt-8">
            <section className="flex flex-col items-center px-8 sm:px-16 justify-center relative w-full">
                <Total />
                <Builder ingredients={ingredients} />
            </section>
            <section className="px-8 sm:px-16 w-full">
                <Controls />
            </section>
        </section>
    )
}
