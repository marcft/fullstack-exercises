import PropTypes from 'prop-types'

import TogglableBlog from './TogglableBlog'

const Blog = ({ blog, userUsername, updateBlog, deleteBlog }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const likeBlog = () => {
    const likedBlog = { ...blog, likes: blog.likes + 1 }
    updateBlog(likedBlog)
  }

  const removeBlog = () => {
    const isConfirmed = window.confirm(`Remove ${blog.title}, ${blog.author}`)
    if (isConfirmed) deleteBlog(blog)
  }

  return (
    <li style={blogStyle}>
      <TogglableBlog title={`${blog.title}, ${blog.author}`}>
        <div>{blog.url}</div>
        <div>
          likes <span className="likes-value">{blog.likes}</span>{' '}
          <button onClick={likeBlog}>like</button>
        </div>
        <div>{blog.user.name}</div>
        {userUsername === blog.user.username && (
          <button onClick={removeBlog}>remove</button>
        )}
      </TogglableBlog>
    </li>
  )
}

Blog.propTypes = {
  blog: PropTypes.shape({
    title: PropTypes.string.isRequired,
    author: PropTypes.string,
    url: PropTypes.string.isRequired,
    likes: PropTypes.number.isRequired,
    user: PropTypes.shape({
      username: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }),
  }),
  userUsername: PropTypes.string.isRequired,
  updateBlog: PropTypes.func.isRequired,
  deleteBlog: PropTypes.func.isRequired,
}

export default Blog
