'use client'
import { useState } from 'react'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'

const EmailPasswordLogin = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const auth = getAuth()

  const handleLogin = async (e: any) => {
    e.preventDefault()
    setError(null)
    try {
      await signInWithEmailAndPassword(auth, email, password)
      // Success: The user is now logged in.
    } catch (err: any) {
      setError(err.message)
    }
  }

  return (
    <form onSubmit={handleLogin}>
      <h2>Log In</h2>
      <input
        type='email'
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder='Email'
        required
        autoComplete='email'
      />
      <input
        type='password'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder='Password'
        required
        autoComplete='current-password'
      />
      <button type='submit'>Log In</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <p>
        Forgot your password? <a href='/forgot-password'>Reset it</a>
      </p>
    </form>
  )
}
export default EmailPasswordLogin
