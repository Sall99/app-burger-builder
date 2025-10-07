/**
 * Announce text to screen readers using ARIA live regions
 * @param message - The message to announce
 * @param priority - The priority level ('polite' or 'assertive')
 */
export function announce(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
    let liveRegion = document.getElementById('live-region')

    if (!liveRegion) {
        liveRegion = document.createElement('div')
        liveRegion.id = 'live-region'
        liveRegion.setAttribute('aria-live', 'polite')
        liveRegion.setAttribute('aria-atomic', 'true')
        liveRegion.className = 'sr-only'
        document.body.appendChild(liveRegion)
    }

    liveRegion.setAttribute('aria-live', priority)

    liveRegion.textContent = ''
    setTimeout(() => {
        liveRegion.textContent = message
    }, 100)
}

/**
 * Trap focus within an element (useful for modals)
 * @param element - The element to trap focus within
 * @returns Cleanup function
 */
export function trapFocus(element: HTMLElement): () => void {
    const focusableElements = element.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )

    const firstElement = focusableElements[0] as HTMLElement
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

    const handleTabKey = (e: KeyboardEvent) => {
        if (e.key === 'Tab') {
            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    lastElement.focus()
                    e.preventDefault()
                }
            } else {
                if (document.activeElement === lastElement) {
                    firstElement.focus()
                    e.preventDefault()
                }
            }
        }
    }

    element.addEventListener('keydown', handleTabKey)
    firstElement?.focus()

    return () => {
        element.removeEventListener('keydown', handleTabKey)
    }
}

/**
 * Handle keyboard activation (Enter/Space keys)
 * @param event - The keyboard event
 * @param callback - The function to call on activation
 */
export function handleActivation(event: React.KeyboardEvent, callback: () => void): void {
    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        callback()
    }
}

/**
 * Detect if user is navigating with keyboard
 * Adds 'user-is-tabbing' class to body when Tab is pressed
 */
export function detectKeyboardNavigation(): void {
    let hadKeyboardEvent = false

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Tab') {
            hadKeyboardEvent = true
            document.body.classList.add('user-is-tabbing')
        }
    }

    const handleMouseDown = () => {
        if (hadKeyboardEvent) {
            document.body.classList.remove('user-is-tabbing')
            hadKeyboardEvent = false
        }
    }

    document.addEventListener('keydown', handleKeyDown, true)
    document.addEventListener('mousedown', handleMouseDown, true)
}

/**
 * Live region class for persistent announcements
 */
export class LiveRegion {
    private element: HTMLElement

    constructor(priority: 'polite' | 'assertive' = 'polite') {
        this.element = document.createElement('div')
        this.element.setAttribute('aria-live', priority)
        this.element.setAttribute('aria-atomic', 'true')
        this.element.className = 'sr-only'
        document.body.appendChild(this.element)
    }

    announce(message: string): void {
        this.element.textContent = message
    }

    destroy(): void {
        this.element.remove()
    }
}
