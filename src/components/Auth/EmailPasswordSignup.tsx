'use client'
import React, { useState } from 'react'
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from 'firebase/auth'

const EmailPasswordSignup: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  const auth = getAuth()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setMessage(null)

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      )
      // Define the redirect URL
      const actionCodeSettings = {
        // This is the URL that the user is sent to after email verification.
        // It must be in the list of authorized domains in the Firebase console.
        url: 'http://localhost:5174/chat', // Replace with your Vercel URL for production
        // Optional: Other settings
        handleCodeInApp: true,
      }

      // Once the user is created, send the verification email
      await sendEmailVerification(userCredential.user, actionCodeSettings)
      // Save the email for later use in the verification handler
      window.localStorage.setItem('emailForSignIn', email)
      setMessage(
        'Account created! A verification email has been sent to your inbox.'
      )
    } catch (err: any) {
      console.error(err)
      setError(err.message)
    }
  }

  return (
    <form onSubmit={handleSignup}>
      <h2>Sign Up</h2>
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
      <button type='submit'>Sign Up</button>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  )
}

export default EmailPasswordSignup
