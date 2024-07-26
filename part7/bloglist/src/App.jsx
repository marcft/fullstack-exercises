import { useContext } from 'react'
import { useQuery } from '@tanstack/react-query'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Home from './components/home/Home'
import Users from './components/users/Users'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'

import blogService from './services/blogs'
import loginService from './services/login'
import UserContext from './UserContext'
import { useNotificationReducer } from './hooks/notificationReducer'

const App = () => {
  const [user, userDispatch] = useContext(UserContext)

  const { data: blogs, isPending } = useQuery({
    queryKey: ['blogs'],
    queryFn: blogService.getAll,
    refetchOnWindowFocus: false,
  })

  const [notification, notificationDispatch] = useNotificationReducer()

  const notify = (message, type) => {
    notificationDispatch({ type, payload: message })
    setTimeout(() => {
      notificationDispatch({ type: 'remove' })
    }, 5000)
  }

  const handleLogin = async (userObject) => {
    try {
      const loggedUser = await loginService.login(userObject)
      userDispatch({ type: 'set', payload: loggedUser })
    } catch (exception) {
      const error = exception.response.data.error
      notify(error, 'error')
    }
  }

  const logout = () => {
    userDispatch({ type: 'remove' })
    location.reload()
  }

  if (isPending) {
    return <div>Loading blogs...</div>
  }

  if (user === null) {
    return (
      <>
        <Notification
          successMessage={notification.successMessage}
          errorMessage={notification.errorMessage}
        />
        <LoginForm loginUser={handleLogin} />
      </>
    )
  }

  return (
    <>
      <h2>Blogs</h2>

      <Notification
        successMessage={notification.successMessage}
        errorMessage={notification.errorMessage}
      />

      <div>
        <p style={{ display: 'inline' }}>{user.name} logged in</p>{' '}
        <button onClick={logout}>logout</button>
      </div>

      <BrowserRouter>
        <Routes>
          <Route path="/users" element={<Users />} />
          <Route path="/" element={<Home blogs={blogs} notify={notify} />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
