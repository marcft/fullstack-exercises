const { test, expect, beforeEach, describe } = require('@playwright/test')
const { name } = require('../playwright.config')

const loginWith = async (page, username, password) => {
  await page.getByLabel('Username:').fill(username)
  await page.getByLabel('Password:').fill(password)
  await page.getByRole('button', { name: 'Login' }).click()
}

const createBlog = async (page, title, author, url) => {
  await page.getByRole('button', { name: 'new blog' }).click()
  await page.getByLabel('Title:').fill(title)
  await page.getByLabel('Author:').fill(author)
  await page.getByLabel('Url:').fill(url)
  await page.getByRole('button', { name: 'create' }).click()
  await page.getByRole('listitem').getByText(title).waitFor()
}

const likeBlog = async (blog, times) => {
  await blog.getByRole('button', { name: 'view' }).click()
  for (let i = 0; i < times; i++) {
    await blog.getByRole('button', { name: 'like' }).click()
    await blog.getByText(`likes ${i + 1}`).waitFor()
  }
}

module.exports = { loginWith, createBlog, likeBlog }
