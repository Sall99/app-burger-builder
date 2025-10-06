import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

import Content from './content'

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations('Pages.History')

    return {
        title: t('title')
    }
}

const OrderHistory = () => {
    return <Content />
}

export default OrderHistory
