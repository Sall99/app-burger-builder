import { batchAsync, retryAsync, safeAsync, withTimeout } from '../async-handler'

describe('Async Handler Utilities', () => {
    describe('safeAsync', () => {
        it('should return [null, data] on success', async () => {
            const promise = Promise.resolve('success')
            const [error, data] = await safeAsync(promise)

            expect(error).toBeNull()
            expect(data).toBe('success')
        })

        it('should return [error, null] on failure', async () => {
            const promise = Promise.reject(new Error('failed'))
            const [error, data] = await safeAsync(promise)

            expect(error).toBeInstanceOf(Error)
            expect(error?.message).toBe('failed')
            expect(data).toBeNull()
        })

        it('should convert non-Error rejections to Error', async () => {
            const promise = Promise.reject('string error')
            const [error, data] = await safeAsync(promise)

            expect(error).toBeInstanceOf(Error)
            expect(error?.message).toBe('string error')
            expect(data).toBeNull()
        })
    })

    describe('retryAsync', () => {
        it('should succeed on first try', async () => {
            const fn = jest.fn().mockResolvedValue('success')
            const result = await retryAsync(fn, { retries: 3 })

            expect(result).toBe('success')
            expect(fn).toHaveBeenCalledTimes(1)
        })

        it('should retry on failure', async () => {
            const fn = jest
                .fn()
                .mockRejectedValueOnce(new Error('fail 1'))
                .mockRejectedValueOnce(new Error('fail 2'))
                .mockResolvedValue('success')

            const result = await retryAsync(fn, { retries: 3, delayMs: 10 })

            expect(result).toBe('success')
            expect(fn).toHaveBeenCalledTimes(3)
        })

        it('should throw after max retries', async () => {
            const fn = jest.fn().mockRejectedValue(new Error('always fails'))

            await expect(retryAsync(fn, { retries: 2, delayMs: 10 })).rejects.toThrow(
                'always fails'
            )

            expect(fn).toHaveBeenCalledTimes(3) // Initial + 2 retries
        })

        it('should call onRetry callback', async () => {
            const fn = jest
                .fn()
                .mockRejectedValueOnce(new Error('fail'))
                .mockResolvedValue('success')
            const onRetry = jest.fn()

            await retryAsync(fn, { retries: 2, delayMs: 10, onRetry })

            expect(onRetry).toHaveBeenCalledWith(1, expect.any(Error))
        })

        it('should use exponential backoff when enabled', async () => {
            const fn = jest
                .fn()
                .mockRejectedValueOnce(new Error('fail 1'))
                .mockRejectedValueOnce(new Error('fail 2'))
                .mockResolvedValue('success')

            const startTime = Date.now()
            await retryAsync(fn, { retries: 2, delayMs: 100, backoff: true })
            const duration = Date.now() - startTime

            // With backoff: 100ms + 200ms = 300ms minimum
            expect(duration).toBeGreaterThanOrEqual(250)
        })
    })

    describe('withTimeout', () => {
        it('should resolve if promise completes in time', async () => {
            const promise = new Promise((resolve) => setTimeout(() => resolve('success'), 50))
            const result = await withTimeout(promise, 200)

            expect(result).toBe('success')
        })

        it('should reject if promise times out', async () => {
            const promise = new Promise((resolve) => setTimeout(() => resolve('success'), 200))

            await expect(withTimeout(promise, 50)).rejects.toThrow(/timed out/)
        })

        it('should use custom timeout error message', async () => {
            const promise = new Promise((resolve) => setTimeout(() => resolve('success'), 200))

            await expect(withTimeout(promise, 50, 'Custom timeout message')).rejects.toThrow(
                'Custom timeout message'
            )
        })
    })

    describe('batchAsync', () => {
        it('should process all items', async () => {
            const items = [1, 2, 3, 4, 5]
            const fn = jest.fn((item: number) => Promise.resolve(item * 2))

            const results = await batchAsync(items, fn, { concurrency: 2 })

            expect(results).toEqual([2, 4, 6, 8, 10])
            expect(fn).toHaveBeenCalledTimes(5)
        })

        it('should respect concurrency limit', async () => {
            const items = [1, 2, 3, 4, 5]
            let concurrent = 0
            let maxConcurrent = 0

            const fn = async (item: number) => {
                concurrent++
                maxConcurrent = Math.max(maxConcurrent, concurrent)
                await new Promise((resolve) => setTimeout(resolve, 50))
                concurrent--
                return item * 2
            }

            await batchAsync(items, fn, { concurrency: 2 })

            expect(maxConcurrent).toBeLessThanOrEqual(2)
        })

        it('should continue on error by default', async () => {
            const items = [1, 2, 3, 4, 5]
            const fn = jest.fn((item: number) => {
                if (item === 3) return Promise.reject(new Error('Error on 3'))
                return Promise.resolve(item * 2)
            })

            const results = await batchAsync(items, fn, { concurrency: 2 })

            expect(results).toHaveLength(5)
            expect(results[2]).toBeNull()
            expect(fn).toHaveBeenCalledTimes(5)
        })

        it('should stop on error when stopOnError is true', async () => {
            const items = [1, 2, 3, 4, 5]
            const fn = jest.fn((item: number) => {
                if (item === 3) return Promise.reject(new Error('Error on 3'))
                return Promise.resolve(item * 2)
            })

            await expect(
                batchAsync(items, fn, { concurrency: 2, stopOnError: true })
            ).rejects.toThrow()
        })
    })
})
