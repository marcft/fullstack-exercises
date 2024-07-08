const { test, expect, beforeEach, describe } = require('@playwright/test')

const { loginWith, createBlog, likeBlog } = require('./helper')
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

      test('a blog can be deleted', async ({ page }) => {
        await createBlog(page, 'TestBlog', 'Tester', 'http://test.com')

        page.on('dialog', (dialog) => dialog.accept())

        const myBlog = page.locator('li', { hasText: 'TestBlog, Tester' })
        await myBlog.getByRole('button', { name: 'view' }).click()
        await myBlog.getByRole('button', { name: 'remove' }).click()

        await expect(myBlog).not.toBeAttached()
      })

      test('only its creator can remove blog', async ({ page, request }) => {
        await createBlog(page, 'TestBlog', 'Tester', 'http://test.com')

        const myBlog = page.locator('li', { hasText: 'TestBlog, Tester' })
        await myBlog.getByRole('button', { name: 'view' }).click()
        await expect(
          myBlog.getByRole('button', { name: 'remove' })
        ).toBeVisible()

        await page.getByRole('button', { name: 'logout' }).click()
        await request.post('/api/users', {
          data: {
            username: 'another',
            name: 'Another User',
            password: 'anotherpass',
          },
        })
        await loginWith(page, 'another', 'anotherpass')
        await expect(page.getByText('Another User logged in')).toBeVisible()

        await myBlog.getByRole('button', { name: 'view' }).click()
        await expect(
          myBlog.getByRole('button', { name: 'remove' })
        ).not.toBeVisible()
      })

      describe('When a few blogs are created', () => {
        beforeEach(async ({ page }) => {
          await createBlog(page, 'How to blog? 0', 'Blogger', 'http://blog.com')
          await createBlog(page, 'How to blog? 1', 'Blogger', 'http://blog.com')
          await createBlog(page, 'How to blog? 2', 'Blogger', 'http://blog.com')
          await createBlog(page, 'How to blog? 3', 'Blogger', 'http://blog.com')
        })

        test('blogs are ordered according to likes', async ({ page }) => {
          const randomNum = () => Math.floor(Math.random() * 10)
          //Initialize likes
          const firstBlog = page.locator('li', { hasText: 'How to blog? 0' })
          await likeBlog(firstBlog, 1)
          const secondBlog = page.locator('li', { hasText: 'How to blog? 1' })
          await likeBlog(secondBlog, randomNum())
          const thirdBlog = page.locator('li', { hasText: 'How to blog? 2' })
          await likeBlog(thirdBlog, randomNum())
          const fourthBlog = page.locator('li', { hasText: 'How to blog? 3' })
          await likeBlog(fourthBlog, randomNum())

          let previousValue = Number.MAX_VALUE
          for (const blog of await page.getByRole('listitem').all()) {
            const likesValue = await blog.locator('.likes-value').textContent()
            const numericLikesValue = parseInt(likesValue, 10)
            expect(numericLikesValue).toBeLessThanOrEqual(previousValue)
            previousValue = numericLikesValue
          }
        })
      })
    })
  })
})
