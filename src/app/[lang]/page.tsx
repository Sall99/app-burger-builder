'use client'
import { Builder } from '@/components/ui/builder'
import { Controls } from '@/components/ui/control'
import { Total } from '@/components/ui/total/total'
import { getDictionary, locales } from '@/i18n'
import { selectIngredients } from '@/redux/selectors/ingredients'
import { useSelector } from 'react-redux'

type Props = {
    params: {
        lang: locales
    }
}

export default function Home({ params: { lang } }: Props) {
    const { ingredients, totalPrice } = useSelector(selectIngredients)
    return (
        <main className="flex min-h-screen flex-col items-center pt-8">
            <section className="flex flex-col items-center px-8 sm:px-16 justify-center relative w-full">
                <Total />
                <Builder ingredients={ingredients} />
                {/* <TotalMobile /> */}
            </section>
            <section className="px-8 sm:px-16 w-full">
                <Controls />
            </section>
        </main>
    )
}
