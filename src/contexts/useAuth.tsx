import { useContext } from 'react'
import { type AuthContextType } from './AuthContext'
import { AuthContext } from './AuthContext.1'

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
