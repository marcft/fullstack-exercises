import { useContext } from 'react'
import PropTypes from 'prop-types'

import UserContext from '../../UserContext'

const SingleBlog = ({ blog, updateBlog, deleteBlog }) => {
  const [user] = useContext(UserContext)

  const likeBlog = () => {
    const likedBlog = { ...blog, likes: blog.likes + 1 }
    updateBlog(likedBlog)
  }

  const removeBlog = () => {
    const isConfirmed = window.confirm(`Remove ${blog.title}, ${blog.author}`)
    if (isConfirmed) deleteBlog()
  }
  return (
    <>
      <h2>
        {blog.title}, by {blog.author}
      </h2>
      <a href={blog.url}>{blog.url}</a>
      <p>
        likes <span className="likes-value">{blog.likes}</span>{' '}
        <button onClick={likeBlog}>like</button>
      </p>
      <p>added by {blog.user.name}</p>
      {user.username === blog.user.username && (
        <button onClick={removeBlog}>remove</button>
      )}
    </>
  )
}

SingleBlog.propTypes = {
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
  updateBlog: PropTypes.func.isRequired,
  deleteBlog: PropTypes.func.isRequired,
}

export default SingleBlog
