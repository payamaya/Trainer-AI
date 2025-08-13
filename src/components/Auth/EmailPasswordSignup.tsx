'use client'
import React, { useState } from 'react'
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from 'firebase/auth'
import AuthForm from './AuthForm'
import { getFirebaseAppRefererUrl } from '../../utils/getFirebaseAppRefererUrl'
import { errorMessages } from '../../utils/firebaseErrorMessages'
import { triggerWelcomeNotification } from '../../services/NotificationService'
import { saveFCMToken } from '../../services/fcmService'

const EmailPasswordSignup: React.FC = () => {
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const auth = getAuth()

  const handleSignup = async (data: { [key: string]: string }) => {
    setError(null)
    setMessage(null)
    setLoading(true)

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      )
      // ✅ Trigger the welcome notification here
      const userId = userCredential.user.uid

      await saveFCMToken(userId)
      await triggerWelcomeNotification(userId)

      const actionCodeSettings = {
        url: `${getFirebaseAppRefererUrl()}/chat`,
        handleCodeInApp: true,
      }

      // Once the user is created, send the verification email
      await sendEmailVerification(userCredential.user, actionCodeSettings)
      // Save the email for later use in the verification handler
      window.localStorage.setItem('emailForSignIn', data.email)
      setMessage(
        'Account created! A verification email has been sent to your inbox.'
      )
    } catch (err: any) {
      console.error(err)
      const customError =
        errorMessages[err.code] || 'An unexpected error occured'
      setError(customError)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthForm
      formType='signup'
      onSubmit={handleSignup}
      loading={loading}
      error={error}
      message={message}
    />
  )
}

export default EmailPasswordSignup
