const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')

const helper = require('./test_helper')
const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany()

  const blogObjects = helper.initialBlogs.map((blog) => new Blog(blog))
  const promiseSaveArray = blogObjects.map((blog) => blog.save())
  await Promise.all(promiseSaveArray)
})

test.only('GET correct number of blogs in JSON format', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const response = await helper.getBlogsFromDB()
  assert.strictEqual(response.length, helper.initialBlogs.length)
})

test.only('id property present', async () => {
  const response = await helper.getBlogsFromDB()
  response.forEach((blog) => {
    assert(blog.id)
  })
})

test.only('blog created correctly on db', async () => {
  const newBlog = {
    title: 'Guide on how to make blogs',
    author: 'Cool guy',
    url: 'https://testurl.com',
    likes: 7,
  }

  const postedBlogResponse = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const { id, ...postedBlog } = postedBlogResponse.body
  assert.deepStrictEqual(postedBlog, newBlog)

  const response = await helper.getBlogsFromDB()
  assert.strictEqual(response.length, helper.initialBlogs.length + 1)
})

test.only('when likes property missing, defaults to 0', async () => {
  const newBlog = {
    title: 'Awesome blog',
    author: 'Cool guy',
    url: 'https://testurl.com',
  }

  const postedBlogResponse = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const { id, ...postedBlog } = postedBlogResponse.body
  assert.strictEqual(postedBlog.likes, 0)
})

test.only('missing properties title or url, bad request', async () => {
  const newBlogWithoutTitle = {
    author: 'Cool guy',
    url: 'https://testurl.com',
  }

  const newBlogWithoutUrl = {
    title: 'Awesome blog',
    author: 'Cool guy',
  }

  await api.post('/api/blogs').send(newBlogWithoutTitle).expect(400)
  await api.post('/api/blogs').send(newBlogWithoutUrl).expect(400)
})

after(async () => {
  await mongoose.connection.close()
})
