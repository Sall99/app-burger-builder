/**
 * Performance monitoring utilities
 * Provides tools to measure and track performance metrics
 */

interface PerformanceMetric {
    name: string
    value: number
    rating: 'good' | 'needs-improvement' | 'poor'
    timestamp: number
}

/**
 * Report Web Vitals to analytics or monitoring service
 */
export function reportWebVitals(metric: PerformanceMetric): void {
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
        console.log(`[Performance] ${metric.name}:`, {
            value: `${Math.round(metric.value)}ms`,
            rating: metric.rating
        })
    }

    // Send to analytics in production
    if (process.env.NODE_ENV === 'production' && typeof window !== 'undefined') {
        // Google Analytics
        if (window.gtag) {
            window.gtag('event', metric.name, {
                value: Math.round(metric.value),
                metric_rating: metric.rating,
                metric_delta: metric.value
            })
        }

        // Custom API endpoint
        sendToAnalytics(metric)
    }
}

/**
 * Send metrics to custom analytics endpoint
 */
function sendToAnalytics(metric: PerformanceMetric): void {
    try {
        fetch('/api/analytics/performance', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(metric)
        }).catch((err) => {
            // Fail silently to prevent error loops
            console.warn('Failed to send performance metric:', err)
        })
    } catch {
        // Fail silently
    }
}

/**
 * Measure component render time
 */
export function measureRender(componentName: string, callback: () => void): void {
    const startTime = performance.now()
    callback()
    const endTime = performance.now()
    const duration = endTime - startTime

    if (process.env.NODE_ENV === 'development') {
        console.log(`[Render] ${componentName}: ${duration.toFixed(2)}ms`)
    }
}

/**
 * Create a performance mark
 */
export function mark(name: string): void {
    if (typeof performance !== 'undefined' && performance.mark) {
        performance.mark(name)
    }
}

/**
 * Measure between two marks
 */
export function measure(name: string, startMark: string, endMark: string): number | null {
    if (typeof performance !== 'undefined' && performance.measure) {
        try {
            performance.measure(name, startMark, endMark)
            const measure = performance.getEntriesByName(name)[0]
            return measure ? measure.duration : null
        } catch (error) {
            console.warn('Performance measurement failed:', error)
            return null
        }
    }
    return null
}

/**
 * Get performance metrics
 */
export function getPerformanceMetrics(): PerformanceEntry[] {
    if (typeof performance !== 'undefined' && performance.getEntries) {
        return performance.getEntries()
    }
    return []
}

/**
 * Clear performance marks and measures
 */
export function clearPerformance(): void {
    if (typeof performance !== 'undefined') {
        if (performance.clearMarks) performance.clearMarks()
        if (performance.clearMeasures) performance.clearMeasures()
    }
}

/**
 * Monitor long tasks (tasks that block the main thread for > 50ms)
 */
export function monitorLongTasks(): void {
    if (typeof window === 'undefined') return

    try {
        const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                const duration = entry.duration
                if (duration > 50) {
                    console.warn(`[Long Task] ${duration.toFixed(2)}ms`, entry)

                    // Report to analytics
                    if (process.env.NODE_ENV === 'production') {
                        reportWebVitals({
                            name: 'LongTask',
                            value: duration,
                            rating: duration > 200 ? 'poor' : 'needs-improvement',
                            timestamp: Date.now()
                        })
                    }
                }
            }
        })

        observer.observe({ entryTypes: ['longtask'] })
    } catch (error) {
        // PerformanceObserver not supported
    }
}

/**
 * Monitor resource loading times
 */
export function monitorResources(): void {
    if (typeof window === 'undefined') return

    try {
        const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                if (entry.entryType === 'resource') {
                    const resource = entry as PerformanceResourceTiming
                    const duration = resource.duration

                    // Log slow resources (> 1 second)
                    if (duration > 1000) {
                        console.warn(`[Slow Resource] ${resource.name}: ${duration.toFixed(2)}ms`)
                    }
                }
            }
        })

        observer.observe({ entryTypes: ['resource'] })
    } catch (error) {
        // PerformanceObserver not supported
    }
}

/**
 * Get Core Web Vitals rating
 */
export function getWebVitalsRating(
    metricName: string,
    value: number
): 'good' | 'needs-improvement' | 'poor' {
    // Thresholds based on web.dev recommendations
    const thresholds: Record<string, { good: number; poor: number }> = {
        CLS: { good: 0.1, poor: 0.25 },
        FID: { good: 100, poor: 300 },
        FCP: { good: 1800, poor: 3000 },
        LCP: { good: 2500, poor: 4000 },
        TTFB: { good: 800, poor: 1800 },
        INP: { good: 200, poor: 500 }
    }

    const threshold = thresholds[metricName]
    if (!threshold) return 'good'

    if (value <= threshold.good) return 'good'
    if (value <= threshold.poor) return 'needs-improvement'
    return 'poor'
}

/**
 * Initialize performance monitoring
 */
export function initPerformanceMonitoring(): void {
    if (typeof window === 'undefined') return

    // Monitor long tasks
    monitorLongTasks()

    // Monitor resources
    monitorResources()

    // Log initial page load metrics
    if (window.performance && window.performance.timing) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                const perfData = window.performance.timing
                const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart
                const domReadyTime = perfData.domContentLoadedEventEnd - perfData.navigationStart

                console.log('[Performance] Page Load Metrics:', {
                    pageLoadTime: `${pageLoadTime}ms`,
                    domReadyTime: `${domReadyTime}ms`
                })
            }, 0)
        })
    }
}

// Global type declarations
declare global {
    interface Window {
        gtag?: (...args: unknown[]) => void
        dataLayer?: Object[] | undefined
    }
}
