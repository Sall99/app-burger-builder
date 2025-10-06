import React from 'react'
import { render, screen } from '@testing-library/react'

import { ErrorBoundary, withErrorBoundary } from '../error-boundary'

// Component that throws an error
const ThrowError = ({ shouldThrow = true }: { shouldThrow?: boolean }) => {
    if (shouldThrow) {
        throw new Error('Test error')
    }
    return <div>No error</div>
}

describe('ErrorBoundary', () => {
    // Suppress console.error for cleaner test output
    const originalError = console.error
    beforeAll(() => {
        console.error = jest.fn()
    })
    afterAll(() => {
        console.error = originalError
    })

    it('should render children when there is no error', () => {
        render(
            <ErrorBoundary>
                <div>Test content</div>
            </ErrorBoundary>
        )

        expect(screen.getByText('Test content')).toBeInTheDocument()
    })

    it('should catch errors and display fallback UI', () => {
        render(
            <ErrorBoundary>
                <ThrowError />
            </ErrorBoundary>
        )

        expect(screen.getByText('Oops! Something went wrong')).toBeInTheDocument()
        expect(screen.getByText(/We're sorry for the inconvenience/)).toBeInTheDocument()
    })

    it('should render custom fallback when provided', () => {
        const customFallback = <div>Custom error message</div>

        render(
            <ErrorBoundary fallback={customFallback}>
                <ThrowError />
            </ErrorBoundary>
        )

        expect(screen.getByText('Custom error message')).toBeInTheDocument()
        expect(screen.queryByText('Oops! Something went wrong')).not.toBeInTheDocument()
    })

    it('should call onError callback when error occurs', () => {
        const onError = jest.fn()

        render(
            <ErrorBoundary onError={onError}>
                <ThrowError />
            </ErrorBoundary>
        )

        expect(onError).toHaveBeenCalledWith(
            expect.any(Error),
            expect.objectContaining({
                componentStack: expect.any(String)
            })
        )
    })

    it('should display error details in development mode', () => {
        // Workaround for read-only process.env.NODE_ENV in Jest
        const originalEnv = process.env.NODE_ENV
        Object.defineProperty(process.env, 'NODE_ENV', {
            value: 'development',
            configurable: true
        })

        render(
            <ErrorBoundary>
                <ThrowError />
            </ErrorBoundary>
        )

        expect(screen.getByText(/Error Details/)).toBeInTheDocument()

        // Restore process.env.NODE_ENV using Object.defineProperty to avoid assignment error
        Object.defineProperty(process.env, 'NODE_ENV', {
            value: originalEnv,
            configurable: true
        })
    })

    it('should have reload button', () => {
        render(
            <ErrorBoundary>
                <ThrowError />
            </ErrorBoundary>
        )

        expect(screen.getByRole('button', { name: /reload page/i })).toBeInTheDocument()
    })
})

describe('withErrorBoundary HOC', () => {
    const originalError = console.error
    beforeAll(() => {
        console.error = jest.fn()
    })
    afterAll(() => {
        console.error = originalError
    })

    it('should wrap component with error boundary', () => {
        const TestComponent = () => <div>Test component</div>
        const WrappedComponent = withErrorBoundary(TestComponent)

        render(<WrappedComponent />)

        expect(screen.getByText('Test component')).toBeInTheDocument()
    })

    it('should catch errors in wrapped component', () => {
        const WrappedComponent = withErrorBoundary(ThrowError)

        render(<WrappedComponent />)

        expect(screen.getByText('Oops! Something went wrong')).toBeInTheDocument()
    })

    it('should use custom fallback when provided', () => {
        const customFallback = <div>Custom HOC fallback</div>
        const WrappedComponent = withErrorBoundary(ThrowError, customFallback)

        render(<WrappedComponent />)

        expect(screen.getByText('Custom HOC fallback')).toBeInTheDocument()
    })

    it('should set display name correctly', () => {
        const TestComponent = () => <div>Test</div>
        TestComponent.displayName = 'TestComponent'

        const WrappedComponent = withErrorBoundary(TestComponent)

        expect(WrappedComponent.displayName).toBe('withErrorBoundary(TestComponent)')
    })
})
