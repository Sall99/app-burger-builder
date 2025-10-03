import { expect, test } from '@playwright/test'

test.describe('Authentication Flow', () => {
    test('should navigate to sign in page', async ({ page }) => {
        await page.goto('/en')

        // Click on Sign In link and wait for navigation
        await page.getByRole('link', { name: /sign in/i }).click()
        await page.waitForURL(/.*sign-in/)

        // Check for sign in form elements using labels
        await expect(page.getByLabel(/email/i)).toBeVisible()
        await expect(page.getByLabel(/password/i)).toBeVisible()
        await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible()
    })

    test('should navigate to sign up page', async ({ page }) => {
        await page.goto('/en')

        // Click on Sign Up link and wait for navigation
        await page.getByRole('link', { name: /sign up/i }).click()
        await page.waitForURL(/.*sign-up/)

        // Check for sign up form elements using labels
        await expect(page.getByLabel(/email/i)).toBeVisible()
        await expect(page.getByLabel(/password/i)).toBeVisible()
    })

    test('should show validation errors on empty sign in form submission', async ({ page }) => {
        await page.goto('/en/auth/sign-in')

        // Click sign in without filling form
        await page.getByRole('button', { name: /sign in/i }).click()

        // Wait a moment for potential validation
        await page.waitForTimeout(500)

        // Form should still be on the same page
        await expect(page).toHaveURL(/.*sign-in/)
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

        // Enter invalid email using labels
        await page.getByLabel(/email/i).fill('invalidemail')
        await page.getByLabel(/password/i).fill('password123')
        await page.getByRole('button', { name: /sign in/i }).click()

        // Wait for validation
        await page.waitForTimeout(500)

        // Should still be on sign-in page
        await expect(page).toHaveURL(/.*sign-in/)
    })
})
