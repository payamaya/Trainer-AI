/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, type ReactNode } from 'react'
import { AuthContext } from './AuthContext.1'
import type { CredentialResponse } from '@react-oauth/google'
import { jwtDecode } from 'jwt-decode'

export interface GoogleUser {
  name: string
  email: string
  picture?: string
}

export interface AuthContextType {
  user: GoogleUser | null
  login: (credentialResponse: any) => void
  logout: () => void
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<GoogleUser | null>(() => {
    const savedUser = localStorage.getItem('googleUser')
    return savedUser ? JSON.parse(savedUser) : null
  })

  const login = (credentialResponse: CredentialResponse) => {
    if (credentialResponse.credential) {
      try {
        const decoded: any = jwtDecode(credentialResponse.credential)
        const userObj: GoogleUser = {
          name: decoded.name,
          email: decoded.email,
          picture: decoded.picture,
        }

        setUser(userObj)
        localStorage.setItem('googleUser', JSON.stringify(userObj))
        return true
      } catch (error) {
        console.error('Login error:', error)
        return false
      }
    }
    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('googleUser')
  }

  const value = {
    user,
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
