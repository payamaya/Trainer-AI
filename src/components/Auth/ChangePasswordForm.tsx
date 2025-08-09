// import { useContext, useState } from 'react'
// import { AuthContext } from '../../contexts/AuthContext'

// const ChangePasswordForm = () => {
//   const authContext = useContext(AuthContext)

//   const [currentPassword, setCurrentPassword] = useState('')
//   const [newPassword, setNewPassword] = useState('')

//   if (!authContext) {
//     return <p>Loading...</p>
//   }

//   const { changePassword } = authContext

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     const success = await changePassword(currentPassword, newPassword)
//     if (success) {
//       alert('Password changed successfully!')
//       setCurrentPassword('')
//       setNewPassword('')
//     }
//   }

//   return (
//     <form onSubmit={handleSubmit}>
//       <h2>Change Password</h2>

//       <input
//         type='password'
//         placeholder='Current password'
//         value={currentPassword}
//         onChange={(e) => setCurrentPassword(e.target.value)}
//         required
//       />

//       <input
//         type='password'
//         placeholder='New password'
//         value={newPassword}
//         onChange={(e) => setNewPassword(e.target.value)}
//         required
//       />

//       <button type='submit'>Update Password</button>
//     </form>
//   )
// }

// export default ChangePasswordForm

import React, { useContext, useState } from 'react'
import { AuthContext } from '../../contexts/AuthContext'
import './ForgotPassword' // You can create a new CSS file and reuse the styles.

const ChangePasswordForm = () => {
  const authContext = useContext(AuthContext)

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('') // New state for confirmation
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  if (!authContext) {
    return <p>Loading...</p>
  }

  const { changePassword } = authContext

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)
    setError(null)
    setLoading(true)

    // Basic client-side validation
    if (newPassword !== confirmNewPassword) {
      setError('❌ New passwords do not match.')
      setLoading(false)
      return
    }

    try {
      const success = await changePassword(currentPassword, newPassword)
      if (success) {
        setMessage('✅ Password changed successfully!')
        setCurrentPassword('')
        setNewPassword('')
        setConfirmNewPassword('')
      }
    } catch (err: any) {
      // You should handle more specific errors here, like wrong current password
      setError('❌ ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='forgot-container'>
      <div className='forgot-card'>
        <h2>Change Password</h2>
        <p className='forgot-subtext'>
          Enter your current password and a new password to update your account.
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type='password'
            placeholder='Current password'
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />

          <input
            type='password'
            placeholder='New password'
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />

          <input
            type='password'
            placeholder='Confirm new password'
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            required
          />

          <button type='submit' disabled={loading}>
            {loading ? 'Updating...' : 'Update Password'}
          </button>

          {message && <p className='success-message'>{message}</p>}
          {error && <p className='error-message'>{error}</p>}
        </form>
      </div>
    </div>
  )
}

export default ChangePasswordForm
