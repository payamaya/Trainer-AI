'use client'
import { useEffect, useState, type ReactNode } from 'react'
import { AuthContext } from './AuthContext'
import { auth } from '../firebase'
import {
  createUserWithEmailAndPassword,
  EmailAuthProvider,
  GithubAuthProvider,
  onAuthStateChanged,
  reauthenticateWithCredential,
  sendEmailVerification,
  signInWithPopup,
  signOut,
  updatePassword,
  type User,
} from 'firebase/auth'
import { authenticateWithFirebase } from '../services/firebaseAuth'
import type { CredentialResponse } from '@react-oauth/google'
import type { GoogleUser } from '../types/user/google-user'

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null)
  const [googleUser, setGoogleUser] = useState<GoogleUser | null>(null)
  // const [emailUser, setEmailUser] = useState<User | null>(null)

  // GitHub login handler
  // GitHub login handler
  const githubLogin = async () => {
    try {
      const provider = new GithubAuthProvider()
      const result = await signInWithPopup(auth, provider)
      const user = result.user

      const githubUser = {
        name: user.displayName || 'Anonymous',
        picture: user.photoURL || '/default-avatar.png',
        email: user.email || '',
        uid: user.uid,
      }

      setGoogleUser(githubUser)
      localStorage.setItem('googleUser', JSON.stringify(githubUser))
      return true
    } catch (error) {
      console.error('GitHub login error:', error)
      return false
    }
  }
  // Unified login handler
  const googleLogin = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) return false

    try {
      const { googleUser } = await authenticateWithFirebase(
        credentialResponse.credential
      )

      setGoogleUser(googleUser)
      localStorage.setItem('googleUser', JSON.stringify(googleUser))
      return true
    } catch (error) {
      console.error('Login error:', error)
      return false
    }
  }
  // Add to your AuthProvider component
  const emailSignup = async (email: string, password: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      )
      const user = userCredential.user

      await sendEmailVerification(user)

      localStorage.setItem('emailForSignIn', email)

      // Prevent flicker: don't wait for onAuthStateChanged to update the UI
      await signOut(auth)

      alert(
        'Account created! Please check your email to verify before logging in.'
      )
      return true
    } catch (error) {
      console.error('Email signup error:', error)
      return false
    }
  }

  // Add the logout function here
  const logout = async () => {
    try {
      await signOut(auth) // Sign out from Firebase
      setGoogleUser(null) // Clear Google user state
      localStorage.removeItem('googleUser')
      console.log('User logged out successfully.')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  // ✅ Change password handler

  const changePassword = async (
    currentPassword: string,
    newPassword: string
  ) => {
    try {
      if (!auth.currentUser) throw new Error('No user is currently logged in.')

      // Firebase requires reauthentication for sensitive actions
      const credential = EmailAuthProvider.credential(
        auth.currentUser.email!,
        currentPassword
      )

      await reauthenticateWithCredential(auth.currentUser, credential)

      // Now update the password
      await updatePassword(auth.currentUser, newPassword)
      alert('Password updated successfully!')
      return true
    } catch (error: any) {
      console.error('Password change error:', error)
      alert(error.message || 'Failed to change password.')
      return false
    }
  }

  // Sync auth state
  // In your AuthProvider component
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // If no user or unverified email-password account → treat as logged out
      if (
        !user ||
        (user.providerData.some((p) => p.providerId === 'password') &&
          !user.emailVerified)
      ) {
        setFirebaseUser(null)
        setGoogleUser(null)
        return
      }

      setFirebaseUser(user)

      // Restore Google/GitHub/email user info
      const savedUser = localStorage.getItem('googleUser')
      if (savedUser) {
        setGoogleUser(JSON.parse(savedUser))
      } else if (user.email) {
        const emailUser = {
          name: user.displayName || user.email.split('@')[0],
          picture: user.photoURL || '/default-avatar.png',
          email: user.email,
          uid: user.uid,
        }
        setGoogleUser(emailUser)
        localStorage.setItem('googleUser', JSON.stringify(emailUser))
      }
    })

    return () => unsubscribe()
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user: googleUser,
        firebaseUser,
        login: googleLogin,
        githubLogin,
        logout,
        emailSignup,
        changePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
