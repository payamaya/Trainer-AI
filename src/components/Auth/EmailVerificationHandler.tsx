'use client'
import React, { useEffect, useState } from 'react'
import { getAuth, applyActionCode, signInWithEmailLink } from 'firebase/auth'
import { useNavigate } from 'react-router-dom' // Assuming you are using React Router

const EmailVerificationHandler: React.FC = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
  const auth = getAuth()

  useEffect(() => {
    const handleVerification = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search)
        const oobCode = urlParams.get('oobCode')

        if (oobCode) {
          // This confirms the email address
          await applyActionCode(auth, oobCode)

          // Get the email from local storage (you need to save it during signup)
          const email = window.localStorage.getItem('emailForSignIn')
          if (!email) {
            throw new Error('Email not found in local storage.')
          }

          // Sign the user in with the email link
          await signInWithEmailLink(auth, email, window.location.href)

          // Once authenticated, redirect to the chat page
          navigate('/chat')
        }
      } catch (err: any) {
        console.error(err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    handleVerification()
  }, [auth, navigate])

  if (loading) {
    return <div>Verifying your email...</div>
  }

  if (error) {
    return <div>Error during email verification: {error}</div>
  }

  return null
}

export default EmailVerificationHandler
