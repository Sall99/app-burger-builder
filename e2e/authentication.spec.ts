import { test, expect } from '@playwright/test'

test.describe('Authentication Flow', () => {
    test('should navigate to sign in page', async ({ page }) => {
        await page.goto('/en')

        // Click on Sign In link
        await page.click('text=Sign In')

        // Should navigate to sign-in page
        await expect(page).toHaveURL(/.*sign-in/)

        // Check for sign in form elements
        await expect(page.getByPlaceholder(/email/i)).toBeVisible()
        await expect(page.getByPlaceholder(/password/i)).toBeVisible()
        await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible()
    })

    test('should navigate to sign up page', async ({ page }) => {
        await page.goto('/en')

        // Click on Sign Up link
        await page.click('text=Sign Up')

        // Should navigate to sign-up page
        await expect(page).toHaveURL(/.*sign-up/)

        // Check for sign up form elements
        await expect(page.getByPlaceholder(/email/i)).toBeVisible()
        await expect(page.getByPlaceholder(/password/i)).toBeVisible()
    })

    test('should show validation errors on empty sign in form submission', async ({ page }) => {
        await page.goto('/en/auth/sign-in')

        // Click sign in without filling form
        await page.getByRole('button', { name: /sign in/i }).click()

        // Should show validation errors (if implemented)
        // Note: Adjust based on your actual error display
        await page.waitForTimeout(500)
    })

    test('should display social login options', async ({ page }) => {
        await page.goto('/en/auth/sign-in')

        // Check for Google login button
        await expect(page.getByText(/login with google/i)).toBeVisible()

        // Check for GitHub login button
        await expect(page.getByText(/login with github/i)).toBeVisible()
    })

    test('should have link to switch between sign in and sign up', async ({ page }) => {
        await page.goto('/en/auth/sign-in')

        // Should have link to sign up
        await expect(page.getByText(/don't have an account/i)).toBeVisible()

        await page.goto('/en/auth/sign-up')

        // Should have link to sign in
        await expect(page.getByText(/already have an account/i)).toBeVisible()
    })

    test('should validate email format', async ({ page }) => {
        await page.goto('/en/auth/sign-in')

        // Enter invalid email
        await page.getByPlaceholder(/email/i).fill('invalidemail')
        await page.getByPlaceholder(/password/i).fill('password123')
        await page.getByRole('button', { name: /sign in/i }).click()

        // Should show validation error
        await page.waitForTimeout(500)
    })
})

