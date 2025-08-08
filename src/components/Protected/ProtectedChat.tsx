'use client'
import { type CredentialResponse } from '@react-oauth/google'
import { useAuth } from '../../contexts/useAuth'
import AIChat from '../Chat/AIChat'
import GoogleAuthPrompt from '../Google/GoogleAuthPrompt'
import '../Chat/AIChat.css'

export default function ProtectedChat() {
  const { user, firebaseUser, login } = useAuth()

  const handleGoogleSuccess = async (
    credentialResponse: CredentialResponse
  ) => {
    if (credentialResponse.credential) {
      try {
        await login(credentialResponse)
      } catch (error) {
        console.error('Authentication failed:', error)
      }
    }
  }
  // Initialize with default values if no profile exists
  if (!user || !firebaseUser) {
    return <GoogleAuthPrompt onGoogleSuccess={handleGoogleSuccess} />
  }

  return (
    <main className='chat-main-container'>
      <AIChat googleUser={user} />
    </main>
  )
}
