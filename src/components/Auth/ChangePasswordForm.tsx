'use client'
import { useContext, useState } from 'react'
import { AuthContext } from '../../contexts/AuthContext'
import AuthForm from './AuthForm'
import './ForgotPassword.css' // We can reuse the CSS

const ChangePasswordForm = () => {
  const authContext = useContext(AuthContext)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  if (!authContext) {
    return <p>Loading...</p>
  }

  const { changePassword } = authContext

  const handleSubmit = async (data: {
    currentPassword?: string
    newPassword?: string
    confirmNewPassword?: string
  }) => {
    setMessage(null)
    setError(null)
    setLoading(true)

    // Basic client-side validation
    if (data.newPassword !== data.confirmNewPassword) {
      setError('❌ New passwords do not match.')
      setLoading(false)
      return
    }

    try {
      const success = await changePassword(
        data.currentPassword!,
        data.newPassword!
      )
      if (success) {
        setMessage('✅ Password changed successfully!')
      }
    } catch (err: any) {
      setError('❌ ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthForm
      formType='changePassword'
      onSubmit={handleSubmit}
      loading={loading}
      error={error}
      message={message}
    />
  )
}

export default ChangePasswordForm
