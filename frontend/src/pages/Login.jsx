import { useState } from 'react'
import { Link } from 'react-router-dom'
import { signIn } from '../services/auth'

function Login({ onAuthSuccess }) {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value })
    setError('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!form.email.trim() || !form.password) {
      setError('Enter your email and password to continue.')
      return
    }

    setIsLoading(true)
    setError('')
    try {
      const user = await signIn(form)
      onAuthSuccess(user)
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card" aria-labelledby="login-title">
        <div className="auth-heading">
          <p className="eyebrow">Welcome back</p>
          <h1 id="login-title">Sign in to CivicBridge</h1>
          <p>Continue turning local insight into positive action.</p>
        </div>
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <label htmlFor="login-email">Email address</label>
          <input id="login-email" name="email" type="email" autoComplete="email" value={form.email} onChange={handleChange} placeholder="you@example.com" required />
          <label htmlFor="login-password">Password</label>
          <input id="login-password" name="password" type="password" autoComplete="current-password" value={form.password} onChange={handleChange} placeholder="Enter your password" required />
          {error && <p className="auth-error" role="alert">{error}</p>}
          <button className="button button-primary auth-submit" type="submit" disabled={isLoading}>{isLoading ? <><span className="button-spinner" aria-hidden="true" /> Signing in...</> : 'Sign in'}</button>
        </form>
        <p className="auth-switch">New to CivicBridge? <Link to="/signup">Create an account</Link></p>
      </section>
    </main>
  )
}

export default Login
