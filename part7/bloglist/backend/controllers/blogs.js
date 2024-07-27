const blogsRouter = require('express').Router()

const { userExtractor } = require('../utils/middleware')
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find().populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id).populate('user', {
    username: 1,
    name: 1,
  })
  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})

blogsRouter.use(userExtractor)

blogsRouter.post('/', async (request, response) => {
  const user = request.user
  const blog = new Blog({ ...request.body, user: user.toJSON().id })

  const savedBlog = await blog.save()
  await savedBlog.populate('user', { username: 1, name: 1 })

  user.blogs = user.blogs.concat(savedBlog.toJSON().id)
  user.save()

  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
  const user = request.user
  const blog = await Blog.findById(request.params.id)
  if (!blog) return response.status(204).end()

  if (user.toJSON().id !== blog.user.toString()) {
    return response
      .status(401)
      .json({ error: "cannot delete another user's blog" })
  }

  await Blog.findByIdAndDelete(blog._id)

  user.blogs = user.blogs.filter((id) => id.toString() !== blog.id.toString())
  user.save()

  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    request.body,
    {
      new: true,
    },
  ).populate('user', { username: 1, name: 1 })

  response.json(updatedBlog)
})

module.exports = blogsRouter
