import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import api from '../../api'
import { useAuth } from '../../Auth/AuthProvider/useAuth'
import './Login.css'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const redirectPath = location.state?.from || '/'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    try {
      const response = await api.post('/users/login', { email, password })
      const { token, name } = response.data
      localStorage.setItem('token', token)
      login({ name, email })
      navigate(redirectPath)
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Login</h2>
        {error && <p className="login-error">{error}</p>}
        <div className="login-form-field">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="login-form-field">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="login-form-actions">
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default Login
