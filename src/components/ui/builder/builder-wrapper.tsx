'use client'

import { useEffect } from 'react'

import { useKeyboardShortcuts } from '@/hooks/use-keyboard-shortcuts'

interface BuilderWrapperProps {
    children: React.ReactNode
}

/**
 * Wrapper component that adds keyboard shortcuts and global event handlers
 * for the burger builder
 */
export function BuilderWrapper({ children }: BuilderWrapperProps) {
    // Enable keyboard shortcuts (Ctrl/Cmd + Z for undo, Ctrl/Cmd + Y for redo)
    useKeyboardShortcuts()

    // Show helpful tooltip on first visit
    useEffect(() => {
        const hasSeenTooltip = localStorage.getItem('burger-builder-tooltip-seen')

        if (!hasSeenTooltip) {
            // Show tooltip after a short delay
            const timer = setTimeout(() => {
                // You can implement a more sophisticated tooltip/toast here
                console.log('💡 Tip: Use Ctrl+Z to undo and Ctrl+Y to redo!')
                localStorage.setItem('burger-builder-tooltip-seen', 'true')
            }, 2000)

            return () => clearTimeout(timer)
        }
    }, [])

    return <div className="builder-wrapper">{children}</div>
}
