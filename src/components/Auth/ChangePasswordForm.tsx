import { useContext, useState } from 'react'
import { AuthContext } from '../../contexts/AuthContext'

const ChangePasswordForm = () => {
  const authContext = useContext(AuthContext)

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')

  if (!authContext) {
    return <p>Loading...</p>
  }

  const { changePassword } = authContext

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const success = await changePassword(currentPassword, newPassword)
    if (success) {
      alert('Password changed successfully!')
      setCurrentPassword('')
      setNewPassword('')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Change Password</h2>

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

      <button type='submit'>Update Password</button>
    </form>
  )
}

export default ChangePasswordForm
