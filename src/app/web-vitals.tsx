'use client'

import { useEffect } from 'react'
import { useReportWebVitals } from 'next/web-vitals'

import { getWebVitalsRating, reportWebVitals } from '@/lib/performance'

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
        if (typeof window !== 'undefined') {
            import('@/lib/performance').then(({ initPerformanceMonitoring }) => {
                initPerformanceMonitoring()
            })
        }
    }, [])

    return null
}
