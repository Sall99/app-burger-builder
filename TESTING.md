# Testing Guide

This document provides comprehensive information about the testing infrastructure for the Burger Builder application.

## Table of Contents

- [Overview](#overview)
- [Test Types](#test-types)
- [Setup](#setup)
- [Running Tests](#running-tests)
- [Writing Tests](#writing-tests)
- [Best Practices](#best-practices)
- [CI/CD Integration](#cicd-integration)
- [Troubleshooting](#troubleshooting)

## Overview

Our testing strategy follows the testing pyramid approach:

- **Unit Tests** (70%): Test individual functions and components in isolation
- **Integration Tests** (20%): Test API routes and data flow
- **E2E Tests** (10%): Test complete user workflows

### Tech Stack

- **Jest**: JavaScript testing framework
- **React Testing Library**: Component testing
- **Playwright**: End-to-end testing
- **MSW**: API mocking (for future use)

## Test Types

### 1. Unit Tests

Located in `__tests__` folders next to the source files.

**Coverage:**

- Redux slices (state management)
- UI components
- Utility functions
- Helper functions

**Example locations:**

```
src/redux/slices/__tests__/ingredients.test.ts
src/components/ui/button/__tests__/button.test.tsx
```

### 2. Integration Tests

Located in `src/app/api/**/__tests__/` folders.

**Coverage:**

- API route handlers
- Database operations
- Authentication flows
- Payment processing

**Example locations:**

```
src/app/api/auth/sign-up/__tests__/route.test.ts
src/app/api/orders/__tests__/integration.test.ts
```

### 3. E2E Tests

Located in the `e2e/` directory.

**Coverage:**

- Complete user workflows
- Navigation and routing
- Authentication flows
- Burger building process
- Order placement

**Example locations:**

```
e2e/burger-builder.spec.ts
e2e/authentication.spec.ts
e2e/navigation.spec.ts
```

## Setup

### Initial Setup

```bash
# Install dependencies (already done if you ran npm install)
npm install

# Install Playwright browsers
npm run playwright:install
```

### Environment Variables

For testing, create a `.env.test` file:

```env
DATABASE_URL="your-test-database-url"
NEXTAUTH_SECRET="test-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

## Running Tests

### All Tests

```bash
# Run all unit and integration tests
npm test

# Run all tests including E2E (CI mode)
npm run test:all
```

### Unit Tests

```bash
# Run unit tests in watch mode
npm test

# Run unit tests once
npm run test:unit

# Run with coverage
npm run test:coverage
```

### Integration Tests

```bash
# Run integration tests only
npm run test:integration
```

### E2E Tests

```bash
# Run E2E tests (headless)
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui

# Run E2E tests in headed mode (see browser)
npm run test:e2e:headed

# Debug E2E tests
npm run test:e2e:debug
```

### Coverage Reports

```bash
# Generate coverage report
npm run test:coverage

# View coverage report
open coverage/lcov-report/index.html
```

**Coverage Thresholds:**

- Branches: 50%
- Functions: 50%
- Lines: 50%
- Statements: 50%

## Writing Tests

### Unit Tests - Redux Slices

```typescript
import { ingredientsReducer, addIngredients } from '../ingredients'

describe('ingredients slice', () => {
    it('should add an ingredient', () => {
        const initialState = {
            ingredients: { meat: 0 },
            prices: { meat: 1.3 },
            totalPrice: 4
        }

        const actual = ingredientsReducer(initialState, addIngredients('meat'))

        expect(actual.ingredients.meat).toBe(1)
        expect(actual.totalPrice).toBe(5.3)
    })
})
```

### Component Tests

```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from '../button'

describe('Button Component', () => {
    it('should call onClick when clicked', () => {
        const handleClick = jest.fn()
        render(<Button label="Click Me" onClick={handleClick} />)

        fireEvent.click(screen.getByText('Click Me'))

        expect(handleClick).toHaveBeenCalledTimes(1)
    })
})
```

### Integration Tests - API Routes

```typescript
import { POST } from '../route'
import { NextRequest } from 'next/server'

describe('POST /api/auth/sign-up', () => {
    it('should create a new user', async () => {
        const request = new NextRequest('http://localhost:3000/api/auth/sign-up', {
            method: 'POST',
            body: JSON.stringify({
                name: 'John Doe',
                email: 'john@example.com',
                password: 'password123'
            })
        })

        const response = await POST(request)
        expect(response.status).toBe(200)
    })
})
```

### E2E Tests

```typescript
import { test, expect } from '@playwright/test'

test('should build a burger', async ({ page }) => {
    await page.goto('/en')

    // Add meat
    const meatControl = page.locator('.controls > div').filter({ hasText: 'Meat' })
    await meatControl.locator('.ctrl > div').first().click()

    // Verify meat is visible
    await expect(page.locator('.Meat')).toBeVisible()
})
```

## Best Practices

### General

1. **Follow AAA Pattern**: Arrange, Act, Assert
2. **One Assertion Per Test**: Keep tests focused
3. **Descriptive Test Names**: Use "should..." format
4. **Test Behavior, Not Implementation**: Focus on what, not how
5. **Keep Tests Independent**: No shared state between tests
6. **Mock External Dependencies**: APIs, databases, etc.

### Component Testing

1. **Test User Interactions**: Clicks, inputs, form submissions
2. **Test Accessibility**: Screen reader support, keyboard navigation
3. **Test Edge Cases**: Empty states, error states, loading states
4. **Avoid Testing Implementation Details**: Don't test internal state or methods
5. **Use Testing Library Queries**: Prefer `getByRole`, `getByLabelText`

### E2E Testing

1. **Test Critical User Paths**: Focus on main user journeys
2. **Use Page Object Model**: For complex pages
3. **Wait Properly**: Use `waitFor` instead of fixed timeouts
4. **Test Across Browsers**: Use Playwright's multi-browser support
5. **Keep Tests Stable**: Avoid flaky tests

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Tests

on: [push, pull_request]

jobs:
    test:
        runs-on: ubuntu-latest

        steps:
            - uses: actions/checkout@v3
            - uses: actions/setup-node@v3
              with:
                  node-version: '22'

            - name: Install dependencies
              run: npm ci

            - name: Run unit tests
              run: npm run test:ci

            - name: Run E2E tests
              run: npm run test:e2e

            - name: Upload coverage
              uses: codecov/codecov-action@v3
```

## Test Coverage

### Current Coverage

Run `npm run test:coverage` to generate coverage report.

**Target Areas:**

- Redux slices: ✅ 100%
- UI Components: 🟡 70%
- API Routes: 🟡 60%
- Utility Functions: ✅ 90%

### Coverage Goals

- **Phase 1** (Current): 50% overall coverage
- **Phase 2** (Next Sprint): 70% overall coverage
- **Phase 3** (Production): 80% overall coverage

## Troubleshooting

### Common Issues

#### Jest: Cannot find module '@/...'

**Solution:** Check `jest.config.ts` has correct module mapping:

```typescript
moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
}
```

#### Playwright: Browser not installed

**Solution:** Run `npm run playwright:install`

#### Tests fail due to environment variables

**Solution:** Create `.env.test` file with required variables

#### E2E tests timeout

**Solution:** Increase timeout in `playwright.config.ts`:

```typescript
use: {
    timeout: 60000 // 60 seconds
}
```

#### Mock not working in tests

**Solution:** Ensure mocks are placed before imports:

```typescript
jest.mock('next-intl')
import { Component } from './component'
```

### Debug Tips

1. **Run Single Test:**

    ```bash
    npm test -- button.test.tsx
    ```

2. **Debug in VS Code:**
   Add to `.vscode/launch.json`:

    ```json
    {
        "type": "node",
        "request": "launch",
        "name": "Jest Debug",
        "program": "${workspaceFolder}/node_modules/.bin/jest",
        "args": ["--runInBand", "${file}"]
    }
    ```

3. **Playwright Debug:**
    ```bash
    npm run test:e2e:debug
    ```

## Resources

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [Playwright Documentation](https://playwright.dev/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

## Contributing

When adding new features:

1. Write tests first (TDD approach recommended)
2. Ensure tests pass locally
3. Maintain or improve coverage
4. Update this document if adding new test patterns

## Questions?

If you have questions about testing, please:

1. Check this documentation
2. Review existing test examples
3. Reach out to the team

---

**Last Updated:** October 2025

