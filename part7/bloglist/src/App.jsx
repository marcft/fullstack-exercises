import { useState, useEffect, useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

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
  const queryClient = useQueryClient()

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

  const updateBlogMutation = useMutation({
    mutationFn: ({ id, blog, token }) => blogService.update(id, blog, token),
    onSuccess: (updatedBlog) => {
      const blogs = queryClient.getQueryData(['blogs'])
      queryClient.setQueryData(
        ['blogs'],
        blogs.map((blog) => (blog.id == updatedBlog.id ? updatedBlog : blog)),
      )
    },
    onError: (exception) => {
      const error = exception.response.data.error
      notify(error, 'error')
    },
  })

  const updateBlog = async (blogObject) => {
    const { id, ...blogData } = blogObject
    blogData.user = blogObject.user.id
    updateBlogMutation.mutate({ id, blog: blogData, token: user.token })
  }

  const deleteBlogMutation = useMutation({
    mutationFn: ({ id, token }) => blogService.remove(id, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
    },
    onError: (exception) => {
      const error = exception.response.data.error
      notify(error, 'error')
    },
  })

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
              deleteBlog={() =>
                deleteBlogMutation.mutate({
                  id: blog.id,
                  token: user.token,
                })
              }
            />
          ))}
      </ul>
    </>
  )
}

export default App
