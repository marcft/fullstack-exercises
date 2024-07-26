import { useQuery } from '@tanstack/react-query'

import userService from '../../services/users'

const Users = () => {
  const { data: users, isPending } = useQuery({
    queryKey: ['users'],
    queryFn: userService.getAll,
    refetchOnWindowFocus: false,
  })

  if (isPending) {
    return <div>Loading users...</div>
  }

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
                <td>{user.name}</td>
                <td>{user.blogs.length}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </>
  )
}

export default Users
