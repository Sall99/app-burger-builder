'use client'

import { useEffect } from 'react'
import { useReportWebVitals } from 'next/web-vitals'

import { getWebVitalsRating, reportWebVitals } from '@/lib/performance'

/**
 * Web Vitals reporting component
 * Automatically reports Core Web Vitals to analytics
 */
export function WebVitals() {
    useReportWebVitals((metric) => {
        const rating = getWebVitalsRating(metric.name, metric.value)

        reportWebVitals({
            name: metric.name,
            value: metric.value,
            rating,
            timestamp: Date.now()
        })
    })

    useEffect(() => {
        // Initialize performance monitoring
        if (typeof window !== 'undefined') {
            import('@/lib/performance').then(({ initPerformanceMonitoring }) => {
                initPerformanceMonitoring()
            })
        }
    }, [])

    return null
}
