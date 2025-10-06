import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

import Content from './content'

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations('Pages.Profile')

    return {
        title: t('title'),
        description: t('description')
    }
}
export default function Profile() {
    return <Content />
}
