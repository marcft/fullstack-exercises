import { useContext, useState } from 'react'
import PropTypes from 'prop-types'

import UserContext from '../UserContext'
import loginService from '../services/login'

import { Button, Input } from '../styled-components'

const LoginForm = ({ notify }) => {
  const [, userDispatch] = useContext(UserContext)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const loggedUser = await loginService.login({ username, password })
      userDispatch({ type: 'set', payload: loggedUser })

      setUsername('')
      setPassword('')
    } catch (exception) {
      const error = exception.response.data.error
      notify(error, 'error')
    }
  }

  return (
    <>
      <h2>Log in to application</h2>
      <form onSubmit={handleLogin}>
        <p>
          <label htmlFor="username">Username: </label>
          <Input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={({ target }) => {
              setUsername(target.value)
            }}
          />
        </p>
        <p>
          <label htmlFor="login-pass">Password: </label>
          <Input
            type="password"
            id="login-pass"
            name="password"
            value={password}
            onChange={({ target }) => {
              setPassword(target.value)
            }}
          />
        </p>
        <Button type="submit">Login</Button>
      </form>
    </>
  )
}

LoginForm.propTypes = {
  notify: PropTypes.func.isRequired,
}

export default LoginForm
