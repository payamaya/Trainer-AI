import { createContext } from 'react'
import type { CredentialResponse } from '@react-oauth/google'
import type { User } from 'firebase/auth'

export interface GoogleUser {
  name: string
  email: string
  picture?: string
}

interface AuthContextType {
  user: GoogleUser | null
  firebaseUser: User | null
  login: (credentialResponse: CredentialResponse) => Promise<boolean>
  logout: () => void
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)
