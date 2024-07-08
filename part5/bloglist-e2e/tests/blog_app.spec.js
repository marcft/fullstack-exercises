const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        username: 'marc',
        name: 'Marc Cool',
        password: 'marcpass',
      },
    })
    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText('Log in to application')).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await page.getByLabel('Username:').fill('marc')
      await page.getByLabel('Password:').fill('marcpass')
      await page.getByRole('button', { name: 'Login' }).click()

      await expect(page.getByText('Marc Cool logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.getByLabel('Username:').fill('marc')
      await page.getByLabel('Password:').fill('wrongpass')
      await page.getByRole('button', { name: 'Login' }).click()

      const errorNotification = page.getByText('invalid username or password')
      await expect(errorNotification).toHaveCSS('font-size', '22px')
      await expect(errorNotification).toHaveCSS('color', 'rgb(255, 0, 0)')

      await expect(page.getByText('Marc Cool logged in')).not.toBeVisible()
    })
  })
})
