import { test, expect } from '@playwright/test'

test.describe('Frontend', () => {
  test('can go on homepage', async ({ page }) => {
    await page.goto('/')

    await expect(page).toHaveTitle(/Minh Kiên Seafood/)

    const heading = page.locator('h1').first()

    await expect(heading).toContainText('Hải sản')
  })

  test('shows 404 for unknown product', async ({ page }) => {
    const resp = await page.goto('/san-pham/this-slug-does-not-exist-xyz')
    expect(resp?.status()).toBe(404)
  })

  test('can navigate to a category page', async ({ page }) => {
    await page.goto('/danh-muc/hai-san-tuoi')
    await expect(page.locator('h1')).toContainText(/Hải sản|Sản phẩm/i)
  })

  test('can open wholesale customer price board', async ({ page }) => {
    await page.goto('/bg/tran-long-7bc3ps')

    await expect(page).toHaveTitle(/Bảng Giá Hải Sản/)
    await expect(page.getByText('Trợ lý chọn hàng theo nhu cầu')).toBeVisible()
    await expect(page.getByText('KHÁCH HÀNG THÂN THIẾT')).toBeVisible()
  })

  test('shows 404 for unknown wholesale link', async ({ page }) => {
    const resp = await page.goto('/bg/this-wholesale-link-does-not-exist')
    expect(resp?.status()).toBe(404)
  })
})
