'use client'
import { useEffect, useState, type ReactNode } from 'react'
import { AuthContext } from './AuthContext'
import { auth } from '../firebase'
import { onAuthStateChanged, signOut, type User } from 'firebase/auth'
import { authenticateWithFirebase } from '../services/firebaseAuth'
import type { CredentialResponse } from '@react-oauth/google'
import type { GoogleUser } from '../types/user/google-user'

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null)
  const [googleUser, setGoogleUser] = useState<GoogleUser | null>(null)

  // Unified login handler
  const login = async (credentialResponse: CredentialResponse) => {
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
      localStorage.removeItem('googleUser') // Clear from local storage
      console.log('User logged out successfully.')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }
  // Sync auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user)
      // Maintain Google user data if available
      if (user) {
        const savedUser = localStorage.getItem('googleUser')
        if (savedUser) {
          setGoogleUser(JSON.parse(savedUser))
        }
      } else {
        setGoogleUser(null)
      }
    })
    return () => unsubscribe()
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user: googleUser,
        firebaseUser,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
