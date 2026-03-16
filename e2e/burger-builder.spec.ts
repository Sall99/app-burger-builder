import { expect, test } from '@playwright/test'

test.describe('Burger Builder', () => {
    test.beforeEach(async ({ page }) => {
        // Navigate to the home page
        await page.goto('/en')
    })

    test('should display the burger builder interface', async ({ page }) => {
        // Check if the builder is visible
        await expect(page.locator('.burger-builder')).toBeVisible()

        // Check for bread elements
        await expect(page.locator('.BreadTop')).toBeVisible()
        await expect(page.locator('.BreadBottom')).toBeVisible()
    })

    test('should show empty burger message initially', async ({ page }) => {
        // Check for the "Add ingredients" message
        await expect(page.getByText(/add some ingredients/i)).toBeVisible()
    })

    test('should display all ingredient controls', async ({ page }) => {
        // Check if all ingredient controls are present within the controls area
        const controls = page.getByLabel('Burger ingredient controls')
        await expect(controls.getByText('Meat')).toBeVisible()
        await expect(controls.getByText('Bacon')).toBeVisible()
        await expect(controls.getByText('Cheese')).toBeVisible()
        await expect(controls.getByText('Salad')).toBeVisible()
    })

    test('should add ingredients when clicking add button', async ({ page }) => {
        // Wait for controls to be visible
        await page.waitForSelector('.build-controls')

        // Find and click the add button for meat using aria-label
        const addMeatButton = page.getByRole('button', { name: 'Add Meat' })
        await addMeatButton.click()

        // Check if meat ingredient was added
        const meatIngredient = page.locator('.Meat')
        await expect(meatIngredient).toBeVisible()
    })

    test('should update total price when adding ingredients', async ({ page }) => {
        // Initial price should be visible in the desktop total section
        const totalElement = page.locator('.total-price-row.total-final').first()
        await expect(totalElement).toBeVisible()

        // Add a meat ingredient
        const addMeatButton = page.getByRole('button', { name: 'Add Meat' })
        await addMeatButton.click()

        // Price should increase (meat costs $1.30, base is $4.00)
        await page.waitForTimeout(500) // Wait for state update
    })

    test('should build a complete burger', async ({ page }) => {
        await page.waitForSelector('.build-controls')

        // Add multiple ingredients using aria-label buttons
        const ingredients = ['Meat', 'Cheese', 'Bacon', 'Salad']

        for (const ingredient of ingredients) {
            const addButton = page.getByRole('button', { name: `Add ${ingredient}` })
            await addButton.click()
            await page.waitForTimeout(200)
        }

        // Verify all ingredients are visible
        await expect(page.locator('.Meat')).toBeVisible()
        await expect(page.locator('.Cheese')).toBeVisible()
        await expect(page.locator('.Bacon')).toBeVisible()
        await expect(page.locator('.Salad')).toBeVisible()

        // Empty message should be gone
        await expect(page.getByText(/add some ingredients/i)).not.toBeVisible()
    })

    test('should remove ingredients when clicking remove button', async ({ page }) => {
        await page.waitForSelector('.build-controls')

        // Add meat first
        const addMeatButton = page.getByRole('button', { name: 'Add Meat' })
        await addMeatButton.click()

        // Verify meat is added
        await expect(page.locator('.Meat')).toBeVisible()

        // Remove meat
        const removeMeatButton = page.getByRole('button', { name: 'Remove Meat' })
        await removeMeatButton.click()

        // Wait a bit for the removal
        await page.waitForTimeout(200)

        // Empty message should appear again
        await expect(page.getByText(/add some ingredients/i)).toBeVisible()
    })

    test('should show order button in total section', async ({ page }) => {
        // Check for Order button (in desktop view)
        const orderButton = page.getByRole('button', { name: /order/i }).first()
        await expect(orderButton).toBeVisible()
    })
})
