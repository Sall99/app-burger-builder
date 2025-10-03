/**
 * Error logging utility
 * Provides centralized error logging with support for various logging services
 */

interface ErrorContext {
    [key: string]: unknown
    userId?: string
    url?: string
    userAgent?: string
    timestamp?: string
    type?: string
    componentStack?: string
}

/**
 * Log levels for different error severities
 */
export enum ErrorLevel {
    ERROR = 'error',
    WARNING = 'warning',
    INFO = 'info',
    DEBUG = 'debug'
}

/**
 * Main error logging function
 */
export function logError(
    error: Error | string,
    context?: ErrorContext,
    level: ErrorLevel = ErrorLevel.ERROR
): void {
    const errorData = {
        message: typeof error === 'string' ? error : error.message,
        stack: error instanceof Error ? error.stack : undefined,
        timestamp: new Date().toISOString(),
        url: typeof window !== 'undefined' ? window.location.href : undefined,
        userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
        ...context
    }

    // Console logging (always enabled)
    if (typeof error === 'string') {
        console.error(`[${level.toUpperCase()}] ${error}`, errorData)
    } else {
        console.error(`[${level.toUpperCase()}] ${error.message}`, error, errorData)
    }

    // Send to error tracking service in production
    if (process.env.NODE_ENV === 'production') {
        sendToErrorTracking(errorData, level)
    }

    // Store in local storage for debugging (development only)
    if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
        storeErrorLocally(errorData)
    }
}

/**
 * Send error to external error tracking service
 * Replace with your preferred service (Sentry, Bugsnag, etc.)
 */
function sendToErrorTracking(errorData: object, level: ErrorLevel): void {
    // Example: Send to Sentry
    // if (window.Sentry) {
    //     window.Sentry.captureException(errorData, { level })
    // }

    // Example: Send to custom API
    try {
        fetch('/api/log-error', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...errorData, level })
        }).catch((err) => {
            // Fail silently to prevent error loops
            console.warn('Failed to send error to tracking service:', err)
        })
    } catch (err) {
        // Fail silently
    }
}

/**
 * Store error in local storage for development debugging
 */
function storeErrorLocally(errorData: object): void {
    try {
        const errors = JSON.parse(localStorage.getItem('app_errors') || '[]')
        errors.push(errorData)

        // Keep only last 50 errors
        if (errors.length > 50) {
            errors.shift()
        }

        localStorage.setItem('app_errors', JSON.stringify(errors))
    } catch (err) {
        // Fail silently if localStorage is not available
    }
}

/**
 * Log API errors with additional context
 */
export function logApiError(
    endpoint: string,
    error: Error | string,
    statusCode?: number,
    context?: ErrorContext
): void {
    logError(error, {
        ...context,
        endpoint,
        statusCode,
        type: 'API_ERROR'
    })
}

/**
 * Log client-side navigation errors
 */
export function logNavigationError(error: Error | string, route: string): void {
    logError(error, {
        route,
        type: 'NAVIGATION_ERROR'
    })
}

/**
 * Log authentication errors
 */
export function logAuthError(error: Error | string, context?: ErrorContext): void {
    logError(error, {
        ...context,
        type: 'AUTH_ERROR'
    })
}

/**
 * Clear stored errors (development utility)
 */
export function clearStoredErrors(): void {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('app_errors')
    }
}

/**
 * Get stored errors (development utility)
 */
export function getStoredErrors(): object[] {
    if (typeof window !== 'undefined') {
        try {
            return JSON.parse(localStorage.getItem('app_errors') || '[]')
        } catch {
            return []
        }
    }
    return []
}
