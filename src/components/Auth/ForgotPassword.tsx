'use client'
import React, { useState } from 'react'
import { getAuth, sendPasswordResetEmail } from 'firebase/auth'
import './ForgotPassword.css' // Import our CSS

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const auth = getAuth()

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)
    setError(null)
    setLoading(true)

    try {
      await sendPasswordResetEmail(auth, email, {
        url: 'https://trainer-ai-six.vercel.app/reset-password',
        handleCodeInApp: false,
      })
      setMessage('✅ Password reset email sent! Please check your inbox.')
    } catch (err: any) {
      setError('❌ ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='forgot-container'>
      <div className='forgot-card'>
        <h2>Reset Your Password</h2>
        <p className='forgot-subtext'>
          Enter your registered email and we’ll send you a reset link.
        </p>

        <form onSubmit={handleResetPassword}>
          <input
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder='you@example.com'
            required
            autoComplete='email'
          />

          <button type='submit' disabled={loading}>
            {loading ? 'Sending...' : 'Send Reset Email'}
          </button>

          {message && <p className='success-message'>{message}</p>}
          {error && <p className='error-message'>{error}</p>}
        </form>
      </div>
    </div>
  )
}

export default ForgotPassword
