import Togglable from './Togglable'

const TogglableWithTitle = (props) => {
  return (
    <div>
      {props.title} <Togglable buttonLabel="view">{props.children}</Togglable>
    </div>
  )
}

const Blog = ({ blog, updateBlog }) => {
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

  return (
    <li style={blogStyle}>
      <TogglableWithTitle title={`${blog.title}, ${blog.author}`}>
        <div>{blog.url}</div>
        <div>
          likes {blog.likes} <button onClick={likeBlog}>like</button>
        </div>
        <div>{blog.user.name}</div>
      </TogglableWithTitle>
    </li>
  )
}

export default Blog
