import { notFound } from 'next/navigation'
import { getRequestConfig } from 'next-intl/server'

const locales: string[] = ['en', 'fr']

export default getRequestConfig(async ({ locale }) => {
    if (!locales.includes(locale as any)) notFound()

    return {
        messages: (await import(`../locales/${locale}.json`)).default
    }
})
