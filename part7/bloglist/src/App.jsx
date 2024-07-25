import { useState, useEffect, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'

import Blog from './components/Blog'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'

import blogService from './services/blogs'
import loginService from './services/login'
import { useNotificationReducer } from './hooks/notificationReducer'

const App = () => {
  const [user, setUser] = useState(null)
  const blogFormRef = useRef()

  const { data: blogs, isPending } = useQuery({
    queryKey: ['blogs'],
    queryFn: blogService.getAll,
    refetchOnWindowFocus: false,
  })

  useEffect(() => {
    const loggedUser = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUser) {
      setUser(JSON.parse(loggedUser))
    }
  }, [])

  const [notification, notificationDispatch] = useNotificationReducer()

  const notify = (message, type) => {
    notificationDispatch({ type, payload: message })
    setTimeout(() => {
      notificationDispatch({ type: 'remove' })
    }, 5000)
  }

  const updateBlog = async (/* blogObject */) => {
    /* const { id, ...blogData } = blogObject
    blogData.user = blogObject.user.id
    const responseBlog = await blogService.update(id, blogData, user.token)

    setBlogs(
      blogs.map((blog) => (blog.id === responseBlog.id ? responseBlog : blog)),
    ) */
  }

  const deleteBlog = async (blog) => {
    await blogService.remove(blog.id, user.token)

    //setBlogs(blogs.filter((b) => b.id !== blog.id))
  }

  const handleLogin = async (userObject) => {
    try {
      const user = await loginService.login(userObject)

      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      setUser(user)
    } catch (exception) {
      const error = exception.response.data.error
      notify(error, 'error')
    }
  }

  const logout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    location.reload()
  }

  if (isPending) {
    return <div>Loading blogs...</div>
  }

  if (user === null) {
    return (
      <>
        <Notification
          successMessage={notification.successMessage}
          errorMessage={notification.errorMessage}
        />
        <LoginForm loginUser={handleLogin} />
      </>
    )
  }

  return (
    <>
      <h2>Blogs</h2>

      <Notification
        successMessage={notification.successMessage}
        errorMessage={notification.errorMessage}
      />

      <div>
        <p style={{ display: 'inline' }}>{user.name} logged in</p>{' '}
        <button onClick={logout}>logout</button>
      </div>

      <Togglable buttonLabel="new blog" ref={blogFormRef}>
        <BlogForm notify={notify} userToken={user.token} />
      </Togglable>

      <hr />
      <ul>
        {blogs
          .sort((a, b) => b.likes - a.likes)
          .map((blog) => (
            <Blog
              key={blog.id}
              blog={blog}
              userUsername={user.username}
              updateBlog={updateBlog}
              deleteBlog={deleteBlog}
            />
          ))}
      </ul>
    </>
  )
}

export default App
