import React from 'react'
import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

import { Content } from './content'

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations('Pages.Help')

    return {
        title: t('title'),
        description: t('description')
    }
}

const Helpage = () => {
    return (
        <div className="mt-4 mb-24">
            <Content />
        </div>
    )
}

export default Helpage
