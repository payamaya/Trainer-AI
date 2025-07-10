// src/contexts/AuthProvider.tsx
import { useEffect, useState, type ReactNode } from 'react'
import { AuthContext } from './AuthContext'
import { auth } from '../firebase'
import { onAuthStateChanged, signOut, type User } from 'firebase/auth'
import { authenticateWithFirebase } from '../services/firebaseAuth'
import type { CredentialResponse } from '@react-oauth/google'
import type { GoogleUser } from '../types'

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null)
  const [googleUser, setGoogleUser] = useState<GoogleUser | null>(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user)
      if (user) {
        const savedUser = localStorage.getItem('googleUser')
        setGoogleUser(savedUser ? JSON.parse(savedUser) : null)
      } else {
        setGoogleUser(null)
      }
    })
    return () => unsubscribe()
  }, [])

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

  const logout = async () => {
    try {
      await signOut(auth)
      setGoogleUser(null)
      localStorage.removeItem('googleUser')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <AuthContext.Provider
      value={{ user: googleUser, firebaseUser, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}
