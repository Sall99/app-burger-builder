/**
 * Rate Limiting Middleware
 * Prevents abuse by limiting the number of requests per IP
 */

import { NextRequest, NextResponse } from 'next/server'

interface RateLimitOptions {
    interval: number // Time window in milliseconds
    uniqueTokenPerInterval: number // Max number of unique tokens per interval
}

interface TokenCount {
    count: number
    resetTime: number
}

// In-memory store for rate limiting (use Redis in production)
const rateLimitMap = new Map<string, TokenCount>()

/**
 * Gets the client IP address from the request
 */
function getClientIp(request: NextRequest): string {
    // Check various headers that might contain the real IP
    const forwarded = request.headers.get('x-forwarded-for')
    const real = request.headers.get('x-real-ip')
    const cfConnectingIp = request.headers.get('cf-connecting-ip')

    if (forwarded) {
        return forwarded.split(',')[0].trim()
    }

    if (real) {
        return real
    }

    if (cfConnectingIp) {
        return cfConnectingIp
    }

    return 'unknown'
}

/**
 * Rate limiter factory
 * @param options - Rate limit configuration
 * @returns Rate limit check function
 */
export function rateLimit(options: RateLimitOptions) {
    const { interval, uniqueTokenPerInterval } = options

    return {
        check: (request: NextRequest, limit: number, token: string) => {
            const now = Date.now()
            const tokenCount = rateLimitMap.get(token)

            if (!tokenCount) {
                // First request from this token
                rateLimitMap.set(token, {
                    count: 1,
                    resetTime: now + interval
                })
                return { success: true, remaining: limit - 1 }
            }

            // Check if we need to reset
            if (now > tokenCount.resetTime) {
                rateLimitMap.set(token, {
                    count: 1,
                    resetTime: now + interval
                })
                return { success: true, remaining: limit - 1 }
            }

            // Check if limit exceeded
            if (tokenCount.count >= limit) {
                const resetIn = Math.ceil((tokenCount.resetTime - now) / 1000)
                return {
                    success: false,
                    remaining: 0,
                    resetIn
                }
            }

            // Increment count
            tokenCount.count++
            return {
                success: true,
                remaining: limit - tokenCount.count
            }
        },
        reset: (token: string) => {
            rateLimitMap.delete(token)
        }
    }
}

/**
 * Default rate limiter configurations
 */
export const limiter = {
    // 10 requests per minute for authentication
    auth: rateLimit({
        interval: 60 * 1000, // 1 minute
        uniqueTokenPerInterval: 500
    }),

    // 30 requests per minute for general API
    api: rateLimit({
        interval: 60 * 1000, // 1 minute
        uniqueTokenPerInterval: 500
    }),

    // 100 requests per minute for read operations
    read: rateLimit({
        interval: 60 * 1000, // 1 minute
        uniqueTokenPerInterval: 500
    }),

    // 5 requests per minute for write operations (orders, payments)
    write: rateLimit({
        interval: 60 * 1000, // 1 minute
        uniqueTokenPerInterval: 500
    })
}

/**
 * Middleware to apply rate limiting
 */
export async function withRateLimit(
    request: NextRequest,
    limiterType: keyof typeof limiter,
    limit: number
): Promise<{ success: true } | NextResponse> {
    const ip = getClientIp(request)
    const token = `${limiterType}:${ip}`

    const result = limiter[limiterType].check(request, limit, token)

    if (!result.success) {
        return NextResponse.json(
            {
                error: 'Too many requests',
                message: 'Please try again later',
                resetIn: result.resetIn
            },
            {
                status: 429,
                headers: {
                    'Retry-After': String(result.resetIn),
                    'X-RateLimit-Limit': String(limit),
                    'X-RateLimit-Remaining': '0',
                    'X-RateLimit-Reset': String(Date.now() + (result.resetIn || 0) * 1000)
                }
            }
        )
    }

    return { success: true }
}

/**
 * Cleanup function to remove old entries
 * Call this periodically in production
 */
export function cleanupRateLimitStore() {
    const now = Date.now()
    const keysToDelete: string[] = []

    rateLimitMap.forEach((value, key) => {
        if (now > value.resetTime) {
            keysToDelete.push(key)
        }
    })

    keysToDelete.forEach((key) => rateLimitMap.delete(key))
}

// Cleanup every 5 minutes
if (typeof window === 'undefined') {
    setInterval(cleanupRateLimitStore, 5 * 60 * 1000)
}
