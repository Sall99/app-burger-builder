import { Total } from '@/components/ui/total/total'
import { getDictionary, locales } from '@/i18n'

type Props = {
    params: {
        lang: locales
    }
}

export default async function Home({ params: { lang } }: Props) {
    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <section className="flex flex-col items-center px-8 sm:px-16 justify-center relative">
                <Total />
                {/* <Builder ingredients={ingredients} /> */}
                {/* <TotalMobile /> */}
            </section>
            <section className="px-8 sm:px-16">{/* <Controls /> */}</section>
        </main>
    )
}
