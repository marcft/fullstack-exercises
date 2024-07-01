import { useState, useEffect } from 'react'

import LoginForm from './components/LoginForm'
import Blog from './components/Blog'

import blogService from './services/blogs'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs))
  }, [])

  if (user === null) {
    return <LoginForm setUser={setUser} />
  }

  return (
    <div>
      <h2>Blogs</h2>
      <p>{user.name} logged in</p>
      <ul>
        {blogs.map((blog) => (
          <Blog key={blog.id} blog={blog} />
        ))}
      </ul>
    </div>
  )
}

export default App
