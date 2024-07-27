const { test, describe, after, before, beforeEach } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')

const helper = require('./test_helper')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')

const api = supertest(app)

describe('blogs API with initial notes', () => {
  let rootUserToken = ''
  before(async () => {
    await User.deleteMany()
    for (const user of helper.initialUsers) {
      await api.post('/api/users').send(user).expect(201)
    }

    const response = await api.post('/api/login').send(helper.initialUsers[0])
    rootUserToken = response.body.token
  })

  beforeEach(async () => {
    await Blog.deleteMany()

    for (const blog of helper.initialBlogs) {
      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${rootUserToken}`)
        .send(blog)
    }
  })

  test('id property present', async () => {
    const response = await helper.getBlogsFromDB()
    response.forEach((blog) => {
      assert(blog.id)
    })
  })

  describe('GET', () => {
    test('correct number of blogs in JSON format', async () => {
      await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const response = await helper.getBlogsFromDB()
      assert.strictEqual(response.length, helper.initialBlogs.length)
    })
  })

  describe('POST', () => {
    test('blog created correctly on db', async () => {
      const newBlog = {
        title: 'Guide on how to make blogs',
        author: 'Cool guy',
        url: 'https://testurl.com',
        likes: 7,
      }

      const postedBlogResponse = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${rootUserToken}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      // eslint-disable-next-line no-unused-vars
      const { id, user, ...postedBlog } = postedBlogResponse.body
      assert.deepStrictEqual(postedBlog, newBlog)

      const response = await helper.getBlogsFromDB()
      assert.strictEqual(response.length, helper.initialBlogs.length + 1)
    })

    test('when likes property missing, defaults to 0', async () => {
      const newBlog = {
        title: 'Awesome blog',
        author: 'Cool guy',
        url: 'https://testurl.com',
      }

      const postedBlogResponse = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${rootUserToken}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      assert.strictEqual(postedBlogResponse.body.likes, 0)
    })

    test('missing properties title or url, bad request', async () => {
      const newBlogWithoutTitle = {
        author: 'Cool guy',
        url: 'https://testurl.com',
      }

      const newBlogWithoutUrl = {
        title: 'Awesome blog',
        author: 'Cool guy',
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${rootUserToken}`)
        .send(newBlogWithoutTitle)
        .expect(400)

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${rootUserToken}`)
        .send(newBlogWithoutUrl)
        .expect(400)
    })
  })

  describe('DELETE', () => {
    test('deletion successful', async () => {
      const response = await helper.getBlogsFromDB()

      await api
        .delete(`/api/blogs/${response[0].id}`)
        .set('Authorization', `Bearer ${rootUserToken}`)
        .expect(204)

      const response2 = await helper.getBlogsFromDB()
      assert.strictEqual(response2.length, helper.initialBlogs.length - 1)
    })

    test('when valid id status 204', async () => {
      const validId = helper.validNonExistentId()

      await api
        .delete(`/api/blogs/${validId}`)
        .set('Authorization', `Bearer ${rootUserToken}`)
        .expect(204)

      const response = await helper.getBlogsFromDB()
      assert.strictEqual(response.length, helper.initialBlogs.length)
    })
    test('when invalid id status 400', async () => {
      const invalidId = 'clearlyInvalid'

      await api
        .delete(`/api/blogs/${invalidId}`)
        .set('Authorization', `Bearer ${rootUserToken}`)
        .expect(400)

      const response = await helper.getBlogsFromDB()
      assert.strictEqual(response.length, helper.initialBlogs.length)
    })

    test('when token not provided status 401', async () => {
      const response = await helper.getBlogsFromDB()

      await api.delete(`/api/blogs/${response[0].id}`).expect(401)

      const response2 = await helper.getBlogsFromDB()
      assert.strictEqual(response2.length, helper.initialBlogs.length)
    })
  })

  describe('PUT', () => {
    test('update successful', async () => {
      const response = await helper.getBlogsFromDB()

      const updatedBlog = await api
        .put(`/api/blogs/${response[0].id}`)
        .set('Authorization', `Bearer ${rootUserToken}`)
        .send({ likes: 99 })
        .expect(200)

      delete response[0].user
      delete updatedBlog.body.user

      assert.deepStrictEqual(updatedBlog.body, {
        ...response[0],
        likes: 99,
      })
    })

    test('when invalid request status 400', async () => {
      const response = await helper.getBlogsFromDB()

      await api
        .put(`/api/blogs/${response[0].id}`)
        .set('Authorization', `Bearer ${rootUserToken}`)
        .send({ likes: 'Invalid' })
        .expect(400)
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})
