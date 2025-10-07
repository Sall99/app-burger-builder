'use client'

import { Suspense } from 'react'
import dynamic from 'next/dynamic'

import { Spiner } from '../spiner/spiner'

const DynamicModal = dynamic(() => import('./modal').then((mod) => ({ default: mod.Modal })), {
    loading: () => (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <Spiner />
        </div>
    ),
    ssr: false
})

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
