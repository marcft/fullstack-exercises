const { test, expect, beforeEach, describe } = require('@playwright/test')

const { loginWith, createBlog } = require('./helper')
const { name } = require('../playwright.config')

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
      await loginWith(page, 'marc', 'marcpass')

      await expect(page.getByText('Marc Cool logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'marc', 'wrong-pass')

      const errorNotification = page.getByText('invalid username or password')
      await expect(errorNotification).toHaveCSS('font-size', '22px')
      await expect(errorNotification).toHaveCSS('color', 'rgb(255, 0, 0)')

      await expect(page.getByText('Marc Cool logged in')).not.toBeVisible()
    })

    describe('When logged in', () => {
      beforeEach(async ({ page }) => {
        await loginWith(page, 'marc', 'marcpass')
      })

      test('a new blog can be created', async ({ page }) => {
        await createBlog(page, 'TestBlog', 'Tester', 'http://test.com')

        await expect(page.getByText('TestBlog, Tester')).toBeVisible()
      })

      test('a blog can be edited (liked)', async ({ page }) => {
        await createBlog(page, 'TestBlog', 'Tester', 'http://test.com')

        const myBlog = page.locator('li', { hasText: 'TestBlog, Tester' })
        await myBlog.getByRole('button', { name: 'view' }).click()
        await myBlog.getByRole('button', { name: 'like' }).click()

        await expect(myBlog.getByText('likes 1')).toBeVisible()
      })

      describe('When a blog is created', () => {
        beforeEach(async ({ page }) => {
          await createBlog(page, 'How to blog?', 'Blogger', 'http://blog.com')
        })
      })
    })
  })
})
