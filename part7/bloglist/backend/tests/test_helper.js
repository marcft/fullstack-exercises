const Blog = require('../models/blog')
const User = require('../models/user')

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

const initialUsers = [
  {
    username: 'root',
    name: 'superuser',
    password: 'secret',
  },
  {
    username: 'marc',
    name: 'Marc User',
    password: 'secret2',
  },
]

const getBlogsFromDB = async () => {
  const blogs = await Blog.find()
  return blogs.map((blog) => blog.toJSON())
}

const getUsersFromDB = async () => {
  const users = await User.find()
  return users.map((user) => user.toJSON())
}

const validNonExistentId = () => {
  const blog = new Blog(initialBlogs[0])
  return blog._id.toString()
}

module.exports = {
  initialBlogs,
  initialUsers,
  getBlogsFromDB,
  getUsersFromDB,
  validNonExistentId,
}
