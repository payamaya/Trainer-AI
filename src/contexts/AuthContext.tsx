/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, type ReactNode } from 'react'
import { AuthContext } from './AuthContext.1'

interface GoogleUser {
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

  const login = (credentialResponse: any) => {
    if (credentialResponse.credential) {
      try {
        const base64Url = credentialResponse.credential.split('.')[1]
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split('')
            .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        )

        const userData = JSON.parse(jsonPayload)
        const userObj: GoogleUser = {
          name: userData.name,
          email: userData.email,
          picture: userData.picture,
        }

        setUser(userObj)
        localStorage.setItem('googleUser', JSON.stringify(userObj))
      } catch (error) {
        console.error('Error decoding JWT:', error)
      }
    }
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
