'use client'
import { FC } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'

import { BuilderProps } from '@/types'

import { BurgerIngredients } from '../ingredients'

export const Builder: FC<BuilderProps> = ({ ingredients }) => {
    const t = useTranslations('Builder')
    const arrayIngredients = Object.keys(ingredients)
        .map((igkey) => {
            return [...Array(ingredients[igkey])].map((a, i) => {
                return <BurgerIngredients key={igkey + i} type={igkey} />
            })
        })
        .reduce((arr, currVal) => {
            return arr.concat(currVal)
        }, [])

    return (
        <div className="burger-builder mt-16 sm:mt-1">
            <BurgerIngredients type="BreadTop" />
            {arrayIngredients.length === 0 && (
                <div className="flex items-center flex-col">
                    <div className="w-20 h-20 relative">
                        <Image
                            src="/images/burger-empy.png"
                            alt=""
                            fill
                            priority
                            sizes="(max-width: 640px) 100vw, 640px"
                        />
                    </div>
                    <h2 className=" text-primary-200 mt-1">{t('AddIngredients')}</h2>
                </div>
            )}
            {arrayIngredients.length > 0 && arrayIngredients}
            <BurgerIngredients type="BreadBottom" />
        </div>
    )
}
