import { Suspense } from 'react'
import dynamic from 'next/dynamic'

import { Spiner } from '../ui/spiner/spiner'

const DynamicPopover = dynamic(() => import('./popover'), {
    loading: () => <Spiner />,
    ssr: false
})

export default function PopoverLazy() {
    return (
        <Suspense fallback={<Spiner />}>
            <DynamicPopover />
        </Suspense>
    )
}
