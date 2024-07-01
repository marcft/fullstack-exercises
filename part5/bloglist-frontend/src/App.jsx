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

  useEffect(() => {
    const loggedUser = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUser) {
      setUser(JSON.parse(loggedUser))
    }
  }, [])

  const logout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    location.reload()
  }

  if (user === null) {
    return <LoginForm setUser={setUser} />
  }

  return (
    <div>
      <h2>Blogs</h2>
      <div>
        <p style={{ display: 'inline' }}>{user.name} logged in</p>{' '}
        <button onClick={logout}>logout</button>
      </div>
      <ul>
        {blogs.map((blog) => (
          <Blog key={blog.id} blog={blog} />
        ))}
      </ul>
    </div>
  )
}

export default App
