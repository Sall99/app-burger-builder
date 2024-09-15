import React from 'react'
import { Metadata } from 'next'

import { Content } from './content'

export const metadata: Metadata = {
    title: 'Help',
    description: 'Get assistance with your account, orders, or other inquiries'
}

const Helpage = () => {
    return (
        <div className="mt-4 mb-24">
            <Content />
        </div>
    )
}

export default Helpage
