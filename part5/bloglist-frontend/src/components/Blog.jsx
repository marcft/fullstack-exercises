import Togglable from './Togglable'

const TogglableWithTitle = (props) => {
  return (
    <div>
      {props.title} <Togglable buttonLabel="view">{props.children}</Togglable>
    </div>
  )
}

const Blog = ({ blog }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  return (
    <li style={blogStyle}>
      <TogglableWithTitle title={blog.title}>
        <div>{blog.url}</div>
        <div>
          likes {blog.likes} <button>like</button>
        </div>
        <div>{blog.author}</div>
      </TogglableWithTitle>
    </li>
  )
}

export default Blog
