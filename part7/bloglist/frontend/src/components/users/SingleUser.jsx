import { useParams } from 'react-router-dom'
import PropTypes from 'prop-types'

const SingleUser = ({ users }) => {
  const id = useParams().id
  const user = users.find((user) => user.id === id)

  return (
    <>
      <h2>{user.name}</h2>
      <h3>Added blogs</h3>
      <ul>
        {user.blogs.map((blog) => (
          <li key={blog.id}>{blog.title}</li>
        ))}
      </ul>
    </>
  )
}

SingleUser.propTypes = {
  users: PropTypes.array.isRequired,
}

export default SingleUser
