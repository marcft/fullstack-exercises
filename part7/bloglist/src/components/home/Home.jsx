import { useContext, useRef } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import PropTypes from 'prop-types'

import Togglable from '../Togglable'
import BlogForm from '../BlogForm'
import Blog from '../Blog'
import UserContext from '../../UserContext'

import blogService from '../../services/blogs'

const Home = ({ notify, blogs }) => {
  const [user] = useContext(UserContext)
  const queryClient = useQueryClient()
  const blogFormRef = useRef()

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

  return (
    <>
      <Togglable buttonLabel="new blog" ref={blogFormRef}>
        <BlogForm
          notify={notify}
          userToken={user.token}
          closeForm={() => blogFormRef.current.toggleVisibility()}
        />
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

Home.propTypes = {
  notify: PropTypes.func.isRequired,
  blogs: PropTypes.array.isRequired,
}

export default Home
