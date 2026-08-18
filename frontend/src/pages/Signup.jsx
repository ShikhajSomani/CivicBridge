import { useState } from 'react'
import { Link } from 'react-router-dom'
import { signUp } from '../services/auth'

function Signup({ onAuthSuccess }) {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value })
    setError('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!form.name.trim() || !form.email.trim() || !form.password || !form.confirmPassword) {
      setError('Complete all fields to create your account.')
      return
    }
    if (form.password.length < 8) {
      setError('Your password must be at least 8 characters.')
      return
    }
    if (form.password !== form.confirmPassword) {
      setError('Your passwords do not match.')
      return
    }

    setIsLoading(true)
    setError('')
    try {
      const user = await signUp(form)
      onAuthSuccess(user)
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card auth-card-signup" aria-labelledby="signup-title">
        <div className="auth-heading">
          <p className="eyebrow">Join the bridge</p>
          <h1 id="signup-title">Create your account</h1>
          <p>Build a cleaner future with your community.</p>
        </div>
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <label htmlFor="signup-name">Full name</label>
          <input id="signup-name" name="name" type="text" autoComplete="name" value={form.name} onChange={handleChange} placeholder="Your name" required />
          <label htmlFor="signup-email">Email address</label>
          <input id="signup-email" name="email" type="email" autoComplete="email" value={form.email} onChange={handleChange} placeholder="you@example.com" required />
          <label htmlFor="signup-password">Password</label>
          <input id="signup-password" name="password" type="password" autoComplete="new-password" value={form.password} onChange={handleChange} placeholder="At least 8 characters" required />
          <label htmlFor="signup-confirm-password">Confirm password</label>
          <input id="signup-confirm-password" name="confirmPassword" type="password" autoComplete="new-password" value={form.confirmPassword} onChange={handleChange} placeholder="Repeat your password" required />
          {error && <p className="auth-error" role="alert">{error}</p>}
          <button className="button button-primary auth-submit" type="submit" disabled={isLoading}>{isLoading ? <><span className="button-spinner" aria-hidden="true" /> Creating account...</> : 'Create account'}</button>
        </form>
        <p className="auth-switch">Already have an account? <Link to="/login">Sign in</Link></p>
      </section>
    </main>
  )
}

export default Signup
