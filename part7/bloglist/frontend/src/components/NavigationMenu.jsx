import { useContext } from 'react'

import UserContext from '../UserContext'
import { Link } from 'react-router-dom'

const NavigationMenu = () => {
  const [user, userDispatch] = useContext(UserContext)

  const logout = () => {
    userDispatch({ type: 'remove' })
    location.reload()
  }

  return (
    <nav style={{ backgroundColor: 'lightgray' }}>
      <Link to="/">blogs</Link> <Link to="/users">users</Link>{' '}
      <p style={{ display: 'inline' }}>{user.name} logged in</p>{' '}
      <button onClick={logout}>logout</button>
    </nav>
  )
}

export default NavigationMenu
