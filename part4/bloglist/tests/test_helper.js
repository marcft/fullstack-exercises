const Blog = require('../models/blog')

const initialBlogs = [
  {
    title: 'My first blog',
    author: 'Jhon Doe',
    url: 'https://myfirstblog.com',
    likes: 2,
  },
  {
    title: 'Learning to code',
    author: 'Thomas Don',
    url: 'https://learningtocode.com',
    likes: 21,
  },
]

const getBlogsFromDB = async () => {
  const notes = await Blog.find()
  return notes.map((note) => note.toJSON())
}

const validNonExistentId = () => {
  const blog = new Blog(initialBlogs[0])
  return blog._id.toString()
}

module.exports = { initialBlogs, getBlogsFromDB, validNonExistentId }
