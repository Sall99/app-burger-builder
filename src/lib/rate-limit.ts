import { NextRequest, NextResponse } from 'next/server'

interface RateLimitOptions {
    interval: number
    uniqueTokenPerInterval: number
}

interface TokenCount {
    count: number
    resetTime: number
}

const rateLimitMap = new Map<string, TokenCount>()

function getClientIp(request: NextRequest): string {
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
                rateLimitMap.set(token, {
                    count: 1,
                    resetTime: now + interval
                })
                return { success: true, remaining: limit - 1 }
            }

            if (now > tokenCount.resetTime) {
                rateLimitMap.set(token, {
                    count: 1,
                    resetTime: now + interval
                })
                return { success: true, remaining: limit - 1 }
            }

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

export const limiter = {
    auth: rateLimit({
        interval: 60 * 1000,
        uniqueTokenPerInterval: 500
    }),

    api: rateLimit({
        interval: 60 * 1000,
        uniqueTokenPerInterval: 500
    }),

    read: rateLimit({
        interval: 60 * 1000,
        uniqueTokenPerInterval: 500
    }),

    write: rateLimit({
        interval: 60 * 1000,
        uniqueTokenPerInterval: 500
    })
}

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

if (typeof window === 'undefined') {
    setInterval(cleanupRateLimitStore, 5 * 60 * 1000)
}
