import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { redo, undo } from '@/redux/slices/ingredients-enhanced'

/**
 * Global keyboard shortcuts for burger builder
 * - Ctrl/Cmd + Z: Undo
 * - Ctrl/Cmd + Y or Ctrl/Cmd + Shift + Z: Redo
 */
export function useKeyboardShortcuts() {
    const dispatch = useDispatch()

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const isCtrlOrCmd = e.ctrlKey || e.metaKey

            if (!isCtrlOrCmd) return

            if (e.key === 'z' || e.key === 'Z' || e.key === 'y' || e.key === 'Y') {
                e.preventDefault()
            }

            if (e.key === 'z' && !e.shiftKey) {
                dispatch(undo())
            }

            if (e.key === 'y' || (e.key === 'z' && e.shiftKey)) {
                dispatch(redo())
            }
        }

        window.addEventListener('keydown', handleKeyDown)

        return () => {
            window.removeEventListener('keydown', handleKeyDown)
        }
    }, [dispatch])
}
