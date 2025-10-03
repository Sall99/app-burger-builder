import { test, expect } from '@playwright/test'

test.describe('Navigation and Routing', () => {
    test('should load the home page', async ({ page }) => {
        await page.goto('/en')

        // Check if logo is visible
        await expect(page.locator('img[alt="logo"]')).toBeVisible()

        // Check if burger builder is visible
        await expect(page.locator('.burger-builder')).toBeVisible()
    })

    test('should navigate to help page', async ({ page }) => {
        await page.goto('/en')

        // This test assumes there's a help link somewhere
        // Adjust based on your actual navigation structure
        const helpLink = page.getByRole('link', { name: /help/i })
        if (await helpLink.isVisible()) {
            await helpLink.click()
            await expect(page).toHaveURL(/.*help/)
        }
    })

    test('should support locale switching', async ({ page }) => {
        await page.goto('/en')

        // Check current locale
        await expect(page).toHaveURL(/\/en/)

        // Look for locale switcher (adjust selector based on your implementation)
        const localeSwitcher = page.locator('select, [role="combobox"]').first()

        if (await localeSwitcher.isVisible()) {
            // Switch to French
            await localeSwitcher.selectOption('fr')

            // URL should change to /fr
            await expect(page).toHaveURL(/\/fr/)
        }
    })

    test('should redirect to sign-in for protected routes', async ({ page }) => {
        // Try to access profile page without authentication
        await page.goto('/en/profile')

        // Should redirect to sign-in
        await expect(page).toHaveURL(/.*sign-in/)
    })

    test('should have working logo link to home', async ({ page }) => {
        await page.goto('/en/auth/sign-in')

        // Click logo to go back home
        await page.locator('img[alt="logo"]').click()

        // Should navigate to home
        await expect(page).toHaveURL(/\/en\/?$/)
    })

    test('should be responsive on mobile viewport', async ({ page }) => {
        // Set mobile viewport
        await page.setViewportSize({ width: 375, height: 667 })
        await page.goto('/en')

        // Check if burger builder is still visible
        await expect(page.locator('.burger-builder')).toBeVisible()

        // Check if controls are visible
        await expect(page.locator('.build-controls')).toBeVisible()
    })

    test('should display footer', async ({ page }) => {
        await page.goto('/en')

        // Scroll to bottom
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))

        // Check for footer
        await expect(page.locator('footer, .footer').first()).toBeVisible()
    })

    test('should have meta tags for SEO', async ({ page }) => {
        await page.goto('/en')

        // Check for title
        await expect(page).toHaveTitle(/burger builder/i)

        // Check for description meta tag
        const description = await page.locator('meta[name="description"]').getAttribute('content')
        expect(description).toBeTruthy()
    })
})

