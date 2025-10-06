import React from 'react'
import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

import Content from './content'

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations('Pages.TrackOrder')

    return {
        title: t('title')
    }
}

const TrackOrder = () => {
    return <Content />
}

export default TrackOrder
