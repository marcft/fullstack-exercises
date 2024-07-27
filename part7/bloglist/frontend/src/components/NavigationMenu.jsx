import { useContext } from 'react'

import UserContext from '../UserContext'
import { Link } from 'react-router-dom'
import { Button } from '../styled-components'

const NavigationMenu = () => {
  const [user, userDispatch] = useContext(UserContext)

  const logout = () => {
    userDispatch({ type: 'remove' })
    location.reload()
  }

  return (
    <>
      <nav>
        <Link to="/">Blogs</Link> <Link to="/users">Users</Link>{' '}
      </nav>
      <p>
        {user.name} logged in <Button onClick={logout}>logout</Button>
      </p>
    </>
  )
}

export default NavigationMenu
