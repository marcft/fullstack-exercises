import { useState } from 'react'

import loginService from '../services/login'

const LoginForm = ({ setUser }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })

      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      alert('Wrong credentials')
    }
  }

  return (
    <>
      <h2>Log in to application</h2>
      <form onSubmit={handleLogin}>
        <p>
          <label htmlFor="username">Username</label>
          <input
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
          <label htmlFor="login-pass">Password</label>
          <input
            type="password"
            id="login-pass"
            name="password"
            value={password}
            onChange={({ target }) => {
              setPassword(target.value)
            }}
          />
        </p>
        <button type="submit">Login</button>
      </form>
    </>
  )
}

export default LoginForm
