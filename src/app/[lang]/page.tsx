import { getDictionary, locale } from '@/i18n'

type Props = {
    params: {
        lang: locale
    }
}

export default async function Home({ params: { lang } }: Props) {
    const intl = await getDictionary(lang)
    console.log(intl, 'intl')
    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            this is the home page
        </main>
    )
}
