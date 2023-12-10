import { getDictionary, locales } from '@/i18n'

type Props = {
    params: {
        lang: locales
    }
}

export default async function Home({ params: { lang } }: Props) {
    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            this is the home page
        </main>
    )
}
