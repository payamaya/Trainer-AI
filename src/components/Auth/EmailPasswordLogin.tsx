'use client'
import { useState } from 'react'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { errorMessages } from '../../utils/firebaseErrorMessages'
import AuthForm from './AuthForm'

const EmailPasswordLogin = () => {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const auth = getAuth()

  const handleLogin = async (data: { [key: string]: string }) => {
    setError(null)
    setLoading(true)
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password)
    } catch (err: any) {
      console.error(err)
      const customError =
        errorMessages[err.code] || 'An unexpected error occurred.'
      setError(customError)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthForm
      formType='login'
      onSubmit={handleLogin}
      loading={loading}
      error={error}
    />
  )
}
export default EmailPasswordLogin
