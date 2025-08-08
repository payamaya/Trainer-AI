'use client'
import { useEffect, useState, type ReactNode } from 'react'
import { AuthContext } from './AuthContext'
import { auth } from '../firebase'
import {
  GithubAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type User,
} from 'firebase/auth'
import { authenticateWithFirebase } from '../services/firebaseAuth'
import type { CredentialResponse } from '@react-oauth/google'
import type { GoogleUser } from '../types/user/google-user'

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null)
  const [googleUser, setGoogleUser] = useState<GoogleUser | null>(null)
  const [appUser, setAppUser] = useState<GoogleUser | null>(null)
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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // Always update the raw firebaseUser state
      setFirebaseUser(user)

      if (user) {
        // Only set the appUser if the email is verified.
        // This is the gatekeeper for access to protected content.
        if (user.emailVerified) {
          console.log('User email is verified!')

          // Create the unified user object
          const unifiedUser = {
            name: user.displayName || 'Anonymous',
            picture: user.photoURL || '/default-avatar.png',
            email: user.email || '',
            uid: user.uid,
          }
          setAppUser(unifiedUser)

          // You can also handle the Google user data here if needed.
          const savedUser = localStorage.getItem('googleUser')
          if (savedUser) {
            // Optional: You could update googleUser state here too, but it's redundant
            // if you are using the unified appUser object for everything.
            // NOTE setGoogleUser(JSON.parse(savedUser));
          }
        } else {
          // User is logged in but not verified
          console.log('User is logged in but email is not verified.')
          setAppUser(null) // Explicitly set appUser to null to deny access
        }
      } else {
        // User is logged out
        setAppUser(null)
        setGoogleUser(null)
      }
    })
    return () => unsubscribe()
  }, [])
  return (
    <AuthContext.Provider
      value={{
        // user: googleUser,
        user: appUser,
        firebaseUser,
        login: googleLogin,
        githubLogin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
