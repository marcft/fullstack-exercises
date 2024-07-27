import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

const Users = ({ users }) => {
  return (
    <>
      <h2>Users</h2>
      <table>
        <thead>
          <tr>
            <th scope="col">Users</th>
            <th scope="col">Blogs created</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => {
            return (
              <tr key={user.id}>
                <td>
                  <Link to={`/users/${user.id}`}>{user.name}</Link>
                </td>
                <td>{user.blogs.length}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </>
  )
}

Users.propTypes = {
  users: PropTypes.array.isRequired,
}

export default Users
