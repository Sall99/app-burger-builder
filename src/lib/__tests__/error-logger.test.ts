import {
    clearStoredErrors,
    ErrorLevel,
    getStoredErrors,
    logApiError,
    logAuthError,
    logError,
    logNavigationError
} from '../error-logger'

describe('Error Logger', () => {
    const originalConsoleError = console.error
    const originalFetch = global.fetch

    beforeEach(() => {
        console.error = jest.fn()
        global.fetch = jest.fn()

        // Mock localStorage for all tests
        const localStorageMock = {
            getItem: jest.fn(() => '[]'),
            setItem: jest.fn(),
            clear: jest.fn(),
            removeItem: jest.fn()
        }
        Object.defineProperty(window, 'localStorage', {
            value: localStorageMock,
            writable: true
        })
    })

    afterEach(() => {
        console.error = originalConsoleError
        global.fetch = originalFetch
    })

    describe('logError', () => {
        it('should log error to console', () => {
            const error = new Error('Test error')
            logError(error)

            expect(console.error).toHaveBeenCalled()
        })

        it('should log string errors', () => {
            logError('Test error string')

            expect(console.error).toHaveBeenCalledWith(
                expect.stringContaining('[ERROR] Test error string'),
                expect.any(Object)
            )
        })

        it('should include context in error data', () => {
            const error = new Error('Test error')
            const context = { userId: '123', customField: 'value' }

            logError(error, context)

            expect(console.error).toHaveBeenCalledWith(
                expect.any(String),
                error,
                expect.objectContaining({
                    userId: '123',
                    customField: 'value',
                    timestamp: expect.any(String)
                })
            )
        })

        it('should use different log levels', () => {
            logError('Warning message', {}, ErrorLevel.WARNING)

            expect(console.error).toHaveBeenCalledWith(
                expect.stringContaining('[WARNING]'),
                expect.any(Object)
            )
        })
    })

    describe('logApiError', () => {
        it('should log API errors with endpoint and status code', () => {
            logApiError('/api/users', new Error('API failed'), 500, { extra: 'data' })

            expect(console.error).toHaveBeenCalledWith(
                expect.any(String),
                expect.any(Error),
                expect.objectContaining({
                    endpoint: '/api/users',
                    statusCode: 500,
                    type: 'API_ERROR',
                    extra: 'data'
                })
            )
        })
    })

    describe('logNavigationError', () => {
        it('should log navigation errors with route', () => {
            logNavigationError(new Error('Navigation failed'), '/profile')

            expect(console.error).toHaveBeenCalledWith(
                expect.any(String),
                expect.any(Error),
                expect.objectContaining({
                    route: '/profile',
                    type: 'NAVIGATION_ERROR'
                })
            )
        })
    })

    describe('logAuthError', () => {
        it('should log authentication errors', () => {
            logAuthError('Invalid credentials', { username: 'test' })

            expect(console.error).toHaveBeenCalledWith(
                expect.any(String),
                expect.objectContaining({
                    username: 'test',
                    type: 'AUTH_ERROR'
                })
            )
        })
    })

    describe('Local storage (development)', () => {
        it.skip('should store errors in localStorage in development', () => {
            const originalEnv = process.env.NODE_ENV
            Object.defineProperty(process.env, 'NODE_ENV', {
                value: 'development',
                configurable: true,
                writable: true
            })

            // Mock window object for localStorage
            Object.defineProperty(window, 'localStorage', {
                value: {
                    getItem: jest.fn(() => '[]'),
                    setItem: jest.fn(),
                    clear: jest.fn(),
                    removeItem: jest.fn()
                },
                writable: true
            })

            logError('Test error')

            expect(localStorage.setItem).toHaveBeenCalledWith('app_errors', expect.any(String))

            // Restore original NODE_ENV
            Object.defineProperty(process.env, 'NODE_ENV', {
                value: originalEnv,
                configurable: true,
                writable: true
            })
        })

        // Can't assign to process.env.NODE_ENV directly in recent Node.js versions as it's read-only.
        // This block is redundant and can be removed because NODE_ENV is already restored above.

        it('should clear stored errors', () => {
            clearStoredErrors()

            expect(localStorage.removeItem).toHaveBeenCalledWith('app_errors')
        })

        it('should get stored errors', () => {
            const mockErrors = [{ message: 'Error 1' }, { message: 'Error 2' }]
            // Override the default mock for this test
            ;(localStorage.getItem as jest.Mock).mockReturnValue(JSON.stringify(mockErrors))

            const errors = getStoredErrors()

            expect(errors).toEqual(mockErrors)
        })
    })
})
