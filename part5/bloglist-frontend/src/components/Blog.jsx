import { useState } from 'react'

const TogglableBlog = (props) => {
  const [visible, setVisible] = useState(false)

  return (
    <>
      <div style={{ display: 'inline-block', marginRight: 5 }}>
        {props.title}
      </div>
      <button onClick={() => setVisible(!visible)}>
        {visible ? 'hide' : 'view'}
      </button>
      <div style={{ display: visible ? '' : 'none' }}>{props.children}</div>
    </>
  )
}

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
          likes {blog.likes} <button onClick={likeBlog}>like</button>
        </div>
        <div>{blog.user.name}</div>
        {userUsername === blog.user.username && (
          <button onClick={removeBlog}>remove</button>
        )}
      </TogglableBlog>
    </li>
  )
}

export default Blog
