import { createContext } from 'react'
import type { CredentialResponse } from '@react-oauth/google'
import type { User } from 'firebase/auth'
import type { GoogleUser } from '../types/user/google-user'

interface AuthContextType {
  user: GoogleUser | null
  firebaseUser: User | null
  login: (credentialResponse: CredentialResponse) => Promise<boolean>
  githubLogin: () => Promise<boolean>
  emailSignup: (email: string, password: string) => Promise<boolean>
  logout: () => void
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)
