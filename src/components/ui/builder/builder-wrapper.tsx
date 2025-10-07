'use client'

import { useEffect } from 'react'

import { useKeyboardShortcuts } from '@/hooks/use-keyboard-shortcuts'

interface BuilderWrapperProps {
    children: React.ReactNode
}

export function BuilderWrapper({ children }: BuilderWrapperProps) {
    useKeyboardShortcuts()

    useEffect(() => {
        const hasSeenTooltip = localStorage.getItem('burger-builder-tooltip-seen')

        if (!hasSeenTooltip) {
            const timer = setTimeout(() => {
                console.log('💡 Tip: Use Ctrl+Z to undo and Ctrl+Y to redo!')
                localStorage.setItem('burger-builder-tooltip-seen', 'true')
            }, 2000)

            return () => clearTimeout(timer)
        }
    }, [])

    return <div className="builder-wrapper">{children}</div>
}
