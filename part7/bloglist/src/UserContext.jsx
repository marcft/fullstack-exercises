import { createContext, useReducer } from 'react'
import PropTypes from 'prop-types'

const userReducer = (state, action) => {
  switch (action.type) {
    case 'set':
      window.localStorage.setItem(
        'loggedBlogappUser',
        JSON.stringify(action.payload),
      )
      return action.payload

    case 'remove':
      window.localStorage.removeItem('loggedBlogappUser')
      return null

    default:
      throw Error('Unknown user action')
  }
}

const UserContext = createContext()

export const UserContextProvider = ({ children }) => {
  const getLocalStorageUser = () => {
    const loggedUser = window.localStorage.getItem('loggedBlogappUser')
    if (!loggedUser) return null
    return JSON.parse(loggedUser)
  }

  const [user, userDispatch] = useReducer(userReducer, getLocalStorageUser())

  return (
    <UserContext.Provider value={[user, userDispatch]}>
      {children}
    </UserContext.Provider>
  )
}

UserContextProvider.propTypes = {
  children: PropTypes.element,
}

export default UserContext
