'use client'

import { Suspense } from 'react'
import dynamic from 'next/dynamic'

import { Spiner } from '../spiner/spiner'

// Lazy load the Modal component with loading state
const DynamicModal = dynamic(() => import('./modal').then((mod) => ({ default: mod.Modal })), {
    loading: () => (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <Spiner />
        </div>
    ),
    ssr: false // Modal doesn't need SSR
})

/**
 * Lazy-loaded Modal wrapper
 * Use this instead of importing Modal directly for better performance
 */
export function ModalLazy(props: React.ComponentProps<typeof DynamicModal>) {
    return (
        <Suspense
            fallback={
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <Spiner />
                </div>
            }>
            <DynamicModal {...props} />
        </Suspense>
    )
}
