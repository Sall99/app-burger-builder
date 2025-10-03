# Error Handling Guide

This document describes the error handling infrastructure implemented in the Burger Builder application.

## Table of Contents

- [Overview](#overview)
- [Error Boundaries](#error-boundaries)
- [Error Pages](#error-pages)
- [Error Logging](#error-logging)
- [Async Error Handling](#async-error-handling)
- [Best Practices](#best-practices)
- [Testing](#testing)

## Overview

The application implements a comprehensive error handling system with:

- **React Error Boundaries** for catching component errors
- **Next.js Error Pages** for route-level errors
- **Centralized Error Logging** with support for external services
- **Type-safe Async Utilities** for safe promise handling
- **Development Tools** for debugging

## Error Boundaries

### Basic Usage

Wrap components with `ErrorBoundary` to catch JavaScript errors:

```tsx
import { ErrorBoundary } from '@/components'

;<ErrorBoundary>
    <YourComponent />
</ErrorBoundary>
```

### Custom Fallback UI

Provide a custom fallback component:

```tsx
<ErrorBoundary fallback={<CustomErrorUI />}>
    <YourComponent />
</ErrorBoundary>
```

### Error Callback

Get notified when errors occur:

```tsx
<ErrorBoundary
    onError={(error, errorInfo) => {
        console.log('Error caught:', error)
        // Send to analytics, etc.
    }}>
    <YourComponent />
</ErrorBoundary>
```

### Higher-Order Component

Use the HOC to wrap components:

```tsx
import { withErrorBoundary } from '@/components'

const SafeComponent = withErrorBoundary(YourComponent)

// With custom fallback
const SafeComponent = withErrorBoundary(YourComponent, <div>Custom error message</div>)
```

## Error Pages

### Page-Level Errors

`src/app/[locales]/error.tsx` - Catches errors in route segments

**Features:**

- Automatic error logging
- Try again button
- Link to home page
- Error details in development mode
- Error digest for support

### 404 Not Found

`src/app/[locales]/not-found.tsx` - Custom 404 page

**Features:**

- Friendly message
- Navigation links
- Quick links to common pages

### Global Errors

`src/app/global-error.tsx` - Catches errors in root layout

**Features:**

- Critical error handling
- Minimal UI (no layout dependencies)
- Emergency recovery options

## Error Logging

### Location

`src/lib/error-logger.ts`

### Basic Logging

```typescript
import { logError } from '@/lib/error-logger'

try {
    // Your code
} catch (error) {
    logError(error)
}
```

### With Context

```typescript
logError(error, {
    userId: user.id,
    action: 'checkout',
    customField: 'value'
})
```

### Log Levels

```typescript
import { ErrorLevel } from '@/lib/error-logger'

logError('Warning message', {}, ErrorLevel.WARNING)
logError('Info message', {}, ErrorLevel.INFO)
logError('Debug message', {}, ErrorLevel.DEBUG)
```

### Specialized Loggers

#### API Errors

```typescript
import { logApiError } from '@/lib/error-logger'

logApiError('/api/orders', error, 500, {
    method: 'POST',
    userId: '123'
})
```

#### Navigation Errors

```typescript
import { logNavigationError } from '@/lib/error-logger'

logNavigationError(error, '/profile')
```

#### Authentication Errors

```typescript
import { logAuthError } from '@/lib/error-logger'

logAuthError('Invalid credentials', {
    email: user.email
})
```

### Development Tools

#### View Stored Errors

```typescript
import { getStoredErrors } from '@/lib/error-logger'

// In browser console
console.log(getStoredErrors())
```

#### Clear Error Log

```typescript
import { clearStoredErrors } from '@/lib/error-logger'

clearStoredErrors()
```

### Production Integration

The error logger is designed to integrate with services like:

- **Sentry**
- **Bugsnag**
- **LogRocket**
- **Custom API endpoints**

Example Sentry integration:

```typescript
// In src/lib/error-logger.ts
function sendToErrorTracking(errorData: object, level: ErrorLevel): void {
    if (window.Sentry) {
        window.Sentry.captureException(errorData, { level })
    }
}
```

## Async Error Handling

### Location

`src/lib/async-handler.ts`

### Safe Async (Go-style)

Returns `[error, data]` tuple instead of throwing:

```typescript
import { safeAsync } from '@/lib/async-handler'

const [error, data] = await safeAsync(fetchUser())

if (error) {
    // Handle error
    return
}

// Use data safely
```

### Retry with Backoff

```typescript
import { retryAsync } from '@/lib/async-handler'

const data = await retryAsync(() => fetch('/api/data'), {
    retries: 3,
    delayMs: 1000,
    backoff: true, // Exponential backoff
    onRetry: (attempt, error) => {
        console.log(`Retry attempt ${attempt}:`, error)
    }
})
```

### Timeout

```typescript
import { withTimeout } from '@/lib/async-handler'

const data = await withTimeout(
    fetch('/api/slow-endpoint'),
    5000, // 5 seconds
    'Request took too long'
)
```

### Batch Processing

```typescript
import { batchAsync } from '@/lib/async-handler'

const results = await batchAsync(items, async (item) => processItem(item), {
    concurrency: 5, // Process 5 at a time
    stopOnError: false // Continue on errors
})
```

## Best Practices

### 1. Always Log Errors

```typescript
// ❌ Bad
catch (error) {
    console.log(error)
}

// ✅ Good
catch (error) {
    logError(error, { context: 'userAction' })
}
```

### 2. Provide Context

```typescript
// ❌ Bad
logError(error)

// ✅ Good
logError(error, {
    userId: user.id,
    action: 'createOrder',
    orderId: order.id
})
```

### 3. Don't Expose Internals

```typescript
// ❌ Bad
return NextResponse.json({ error: error.message }, { status: 500 })

// ✅ Good
console.error('Database error:', error) // Log server-side
return NextResponse.json({ error: 'Unable to process request' }, { status: 500 })
```

### 4. Use Type-Safe Async Handlers

```typescript
// ❌ Bad
try {
    const data = await fetchData()
    if (!data) throw new Error('No data')
    return data
} catch (error) {
    logError(error)
    return null
}

// ✅ Good
const [error, data] = await safeAsync(fetchData())
if (error) {
    logError(error)
    return null
}
return data
```

### 5. Implement Retry Logic for Network Requests

```typescript
// ✅ Good
const data = await retryAsync(() => fetch('/api/important-data'), { retries: 3, backoff: true })
```

### 6. Use Error Boundaries for UI Components

```tsx
// ✅ Good
export default withErrorBoundary(ComplexComponent)
```

## Component-Specific Error Handling

### Forms

```tsx
import { useForm } from 'react-hook-form'
import { logError } from '@/lib/error-logger'

const onSubmit = async (data: FormData) => {
    try {
        await submitForm(data)
    } catch (error) {
        logError(error, { form: 'signUp', data })
        toast.error('Unable to submit form')
    }
}
```

### API Routes

```typescript
export async function POST(req: Request) {
    try {
        // Your logic
        return NextResponse.json({ success: true })
    } catch (error) {
        logError(error, { route: '/api/endpoint' })
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
```

### Server Components

```tsx
import { logError } from '@/lib/error-logger'

export default async function Page() {
    try {
        const data = await fetchData()
        return <Component data={data} />
    } catch (error) {
        logError(error, { page: 'home' })
        return <ErrorFallback />
    }
}
```

## Testing

### Testing Error Boundaries

```tsx
import { render, screen } from '@testing-library/react'
import { ErrorBoundary } from '@/components'

const ThrowError = () => {
    throw new Error('Test error')
}

test('catches errors', () => {
    render(
        <ErrorBoundary>
            <ThrowError />
        </ErrorBoundary>
    )

    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
})
```

### Testing Error Logging

```typescript
import { logError } from '@/lib/error-logger'

jest.mock('@/lib/error-logger')

test('logs errors', () => {
    const error = new Error('Test error')
    logError(error)

    expect(logError).toHaveBeenCalledWith(error)
})
```

### Testing Async Handlers

```typescript
import { safeAsync } from '@/lib/async-handler'

test('handles promise rejection', async () => {
    const promise = Promise.reject(new Error('Failed'))
    const [error, data] = await safeAsync(promise)

    expect(error).toBeInstanceOf(Error)
    expect(data).toBeNull()
})
```

## Monitoring Setup

### Sentry Integration (Example)

1. Install Sentry:

```bash
npm install @sentry/nextjs
```

2. Update `error-logger.ts`:

```typescript
import * as Sentry from '@sentry/nextjs'

function sendToErrorTracking(errorData: object, level: ErrorLevel): void {
    Sentry.captureException(errorData, { level })
}
```

3. Initialize in `_app.tsx` or `layout.tsx`:

```typescript
import * as Sentry from '@sentry/nextjs'

Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    environment: process.env.NODE_ENV
})
```

## Troubleshooting

### Error Boundary Not Catching Errors

- Error boundaries only catch errors in **render**, **lifecycle methods**, and **constructors**
- They don't catch:
    - Event handlers (use try-catch)
    - Async code (use try-catch or safeAsync)
    - Server-side rendering errors
    - Errors in the error boundary itself

### Console Warnings in Production

Set up proper error tracking to avoid relying on console logs in production.

### Errors Not Logged

Check that:

1. Error logger is imported correctly
2. Network requests to error tracking services aren't blocked
3. CORS is configured for error tracking endpoints

## Resources

- [React Error Boundaries](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)
- [Next.js Error Handling](https://nextjs.org/docs/app/building-your-application/routing/error-handling)
- [Sentry Documentation](https://docs.sentry.io/)
- [Error Handling Best Practices](https://kentcdodds.com/blog/use-react-error-boundary-to-handle-errors-in-react)

---

**Last Updated**: October 2025

For questions about error handling, contact the development team.
