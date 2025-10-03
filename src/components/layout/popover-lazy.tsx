import { Suspense } from 'react'
import dynamic from 'next/dynamic'

import { Spinner } from '../ui/spiner/spiner'

// Lazy load the Popover component
const DynamicPopover = dynamic(() => import('./popover'), {
    loading: () => <Spinner />,
    ssr: false // Popover doesn't need SSR
})

/**
 * Lazy-loaded Popover wrapper
 * Use this for better performance when user authentication state is loaded
 */
export default function PopoverLazy() {
    return (
        <Suspense fallback={<Spinner />}>
            <DynamicPopover />
        </Suspense>
    )
}
