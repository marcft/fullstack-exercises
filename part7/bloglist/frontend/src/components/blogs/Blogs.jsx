import { useContext, useRef } from 'react'
import PropTypes from 'prop-types'

import Togglable from '../Togglable'
import BlogForm from './BlogForm'
import UserContext from '../../UserContext'

import { Link } from 'react-router-dom'

const Blogs = ({ notify, blogs }) => {
  const [user] = useContext(UserContext)
  const blogFormRef = useRef()

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
            <li key={blog.id}>
              <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
            </li>
          ))}
      </ul>
    </>
  )
}

Blogs.propTypes = {
  notify: PropTypes.func.isRequired,
  blogs: PropTypes.array.isRequired,
}

export default Blogs
