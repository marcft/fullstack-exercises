import { useState, useEffect, useRef } from 'react'

import Blog from './components/Blog'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'

import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs))
  }, [])

  useEffect(() => {
    const loggedUser = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUser) {
      setUser(JSON.parse(loggedUser))
    }
  }, [])

  const addBlog = async (blogObject) => {
    const token = user.token

    try {
      const returnedBlog = await blogService.create(blogObject, token)
      blogFormRef.current.toggleVisibility()

      setSuccessMessage(
        `a new blog ${returnedBlog.title} by ${returnedBlog.author} has been added`
      )
      setTimeout(() => {
        setSuccessMessage('')
      }, 5000)

      setBlogs(blogs.concat(returnedBlog))
      return true
    } catch (exception) {
      const error = exception.response.data.error

      setErrorMessage(error)
      setTimeout(() => {
        setErrorMessage('')
      }, 5000)
      return false
    }
  }

  const handleLogin = async (userObject) => {
    try {
      const user = await loginService.login(userObject)

      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      setUser(user)
    } catch (exception) {
      const error = exception.response.data.error
      setErrorMessage(error)

      setTimeout(() => {
        setErrorMessage('')
      }, 5000)
    }
  }

  const logout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    location.reload()
  }

  if (user === null) {
    return (
      <>
        <Notification
          successMessage={successMessage}
          errorMessage={errorMessage}
        />
        <LoginForm loginUser={handleLogin} />
      </>
    )
  }

  return (
    <>
      <h2>Blogs</h2>

      <Notification
        successMessage={successMessage}
        errorMessage={errorMessage}
      />

      <div>
        <p style={{ display: 'inline' }}>{user.name} logged in</p>{' '}
        <button onClick={logout}>logout</button>
      </div>

      <Togglable buttonLabel="new note" ref={blogFormRef}>
        <BlogForm createBlog={addBlog} />
      </Togglable>

      <hr />
      <ul>
        {blogs.map((blog) => (
          <Blog key={blog.id} blog={blog} />
        ))}
      </ul>
    </>
  )
}

export default App
