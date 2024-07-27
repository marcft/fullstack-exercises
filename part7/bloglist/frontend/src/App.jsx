import { useContext } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Routes, Route, useMatch, useNavigate } from 'react-router-dom'

import Blogs from './components/blogs/Blogs'
import Users from './components/users/Users'
import SingleUser from './components/users/SingleUser'
import SingleBlog from './components/blogs/SingleBlog'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'

import blogService from './services/blogs'
import userService from './services/users'
import UserContext from './UserContext'
import { useNotificationReducer } from './hooks/notificationReducer'
import NavigationMenu from './components/NavigationMenu'

const App = () => {
  const [user] = useContext(UserContext)
  const queryClient = useQueryClient()
  const matchSingleBlogUrl = useMatch('/blogs/:id')
  const navigate = useNavigate()

  const { data: blogs, isPending: isPendingBlogs } = useQuery({
    queryKey: ['blogs'],
    queryFn: blogService.getAll,
    refetchOnWindowFocus: false,
  })

  const { data: allUsers, isPending: isPendingUsers } = useQuery({
    queryKey: ['users'],
    queryFn: userService.getAll,
    refetchOnWindowFocus: false,
  })

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

  if (user === null) {
    return (
      <>
        <Notification notificationMessage={notification} />
        <LoginForm notify={notify} />
      </>
    )
  }

  if (isPendingBlogs || isPendingUsers) {
    return <div>Loading data...</div>
  }

  const blog = matchSingleBlogUrl
    ? blogs.find((blog) => blog.id === matchSingleBlogUrl.params.id)
    : null

  return (
    <>
      <NavigationMenu />
      <h2>Blogs App</h2>
      <Notification notificationMessage={notification} />

      <Routes>
        <Route path="/users/:id" element={<SingleUser users={allUsers} />} />
        <Route path="/users" element={<Users users={allUsers} />} />
        <Route
          path="/blogs/:id"
          element={
            <SingleBlog
              blog={blog}
              updateBlog={updateBlog}
              deleteBlog={() => {
                navigate('/')
                deleteBlogMutation.mutate({ id: blog.id, token: user.token })
              }}
              notify={notify}
            />
          }
        />
        <Route path="/" element={<Blogs blogs={blogs} notify={notify} />} />
      </Routes>
    </>
  )
}

export default App
