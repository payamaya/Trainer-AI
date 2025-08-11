'use client'
import React, { useState } from 'react'
import { getAuth, sendPasswordResetEmail } from 'firebase/auth'
import AuthForm from './AuthForm'
import './ForgotPassword.css' // We still need the CSS

const ForgotPassword: React.FC = () => {
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const auth = getAuth()

  const handleResetPassword = async (data: { [key: string]: string }) => {
    setMessage(null)
    setError(null)
    setLoading(true)

    try {
      await sendPasswordResetEmail(auth, data.email, {
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
    <section className='forgot-password'>
      <AuthForm
        formType='forgotPassword'
        onSubmit={handleResetPassword}
        loading={loading}
        error={error}
        message={message}
      />
    </section>
  )
}

export default ForgotPassword
