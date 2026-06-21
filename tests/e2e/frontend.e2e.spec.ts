import { test, expect } from '@playwright/test'

test.describe('Frontend', () => {
  test('can go on homepage', async ({ page }) => {
    await page.goto('/')

    await expect(page).toHaveTitle(/Long Phung Seafood/)

    const heading = page.locator('h1').first()

    await expect(heading).toContainText('Hai san')
  })

  test('shows 404 for unknown product', async ({ page }) => {
    const resp = await page.goto('/san-pham/this-slug-does-not-exist-xyz')
    expect(resp?.status()).toBe(404)
  })

  test('can navigate to a category page', async ({ page }) => {
    await page.goto('/danh-muc/hai-san-tuoi')
    await expect(page.locator('h1')).toContainText(/Hai san|San pham/i)
  })
})
