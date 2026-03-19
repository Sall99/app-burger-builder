import React from 'react'
import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

import { Content } from './content'

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations('Pages.Help')

    return {
        title: 'Help & FAQ | Burger Builder - How to Order Custom Burgers',
        description:
            'Get help with Burger Builder. Learn how to build a custom burger, place an order, track delivery, manage your account, and find answers to frequently asked questions.',
        keywords:
            'burger builder help, how to order burger online, custom burger FAQ, food ordering help, burger delivery help, burger builder support',
        openGraph: {
            title: 'Help & FAQ | Burger Builder',
            description:
                'Learn how to build custom burgers, place orders, and track delivery. Get answers to all your questions.',
            url: 'https://app-burger-builder.vercel.app/en/help'
        }
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
