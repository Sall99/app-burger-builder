import React from 'react'
import { Metadata } from 'next'

import { Help } from '@/components/ui'

export const metadata: Metadata = {
    title: 'Help',
    description: 'Get assistance with your account, orders, or other inquiries'
}

const Helpage = () => {
    return (
        <div>
            <Help />
        </div>
    )
}

export default Helpage
