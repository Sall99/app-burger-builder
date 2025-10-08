export async function safeAsync<T>(promise: Promise<T>): Promise<[null, T] | [Error, null]> {
    try {
        const data = await promise
        return [null, data]
    } catch (error) {
        if (error instanceof Error) {
            return [error, null]
        }
        return [new Error(String(error)), null]
    }
}

/**
 * Retry function with exponential backoff
 */
export async function retryAsync<T>(
    fn: () => Promise<T>,
    options: {
        retries?: number
        delayMs?: number
        backoff?: boolean
        onRetry?: (attempt: number, error: Error) => void
    } = {}
): Promise<T> {
    const { retries = 3, delayMs = 1000, backoff = true, onRetry } = options

    let lastError: Error

    for (let attempt = 0; attempt <= retries; attempt++) {
        try {
            return await fn()
        } catch (error) {
            lastError = error instanceof Error ? error : new Error(String(error))

            if (attempt < retries) {
                onRetry?.(attempt + 1, lastError)

                const delay = backoff ? delayMs * Math.pow(2, attempt) : delayMs
                await new Promise((resolve) => setTimeout(resolve, delay))
            }
        }
    }

    throw lastError!
}

/**
 * Timeout wrapper for promises
 */
export async function withTimeout<T>(
    promise: Promise<T>,
    timeoutMs: number,
    timeoutError?: string
): Promise<T> {
    let timeoutHandle: NodeJS.Timeout

    const timeoutPromise = new Promise<never>((_, reject) => {
        timeoutHandle = setTimeout(() => {
            reject(new Error(timeoutError || `Operation timed out after ${timeoutMs}ms`))
        }, timeoutMs)
    })

    try {
        return await Promise.race([promise, timeoutPromise])
    } finally {
        clearTimeout(timeoutHandle!)
    }
}

/**
 * Batch async operations with concurrency limit
 */
export async function batchAsync<T, R>(
    items: T[],
    fn: (item: T, index: number) => Promise<R>,
    options: {
        concurrency?: number
        stopOnError?: boolean
    } = {}
): Promise<R[]> {
    const { concurrency = 5, stopOnError = false } = options
    const results: R[] = []
    const errors: Error[] = []

    for (let i = 0; i < items.length; i += concurrency) {
        const batch = items.slice(i, i + concurrency)
        const promises = batch.map((item, index) =>
            fn(item, i + index).catch((error) => {
                errors.push(error)
                if (stopOnError) throw error
                return null as R
            })
        )

        const batchResults = await Promise.all(promises)
        results.push(...batchResults)
    }

    if (errors.length > 0 && stopOnError) {
        throw new Error(`Batch processing failed: ${errors[0].message}`)
    }

    return results
}
