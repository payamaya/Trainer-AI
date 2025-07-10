import { db, auth } from '../firebase'
import { collection, addDoc, Timestamp } from 'firebase/firestore'
import type { UserProfile } from '../types/interfaces'

export interface ChatLogPayload {
  userProfile: UserProfile
  userMessage: string
  aiResponse: string
}

const CHAT_LOG_COLLECTION = 'chatLogs'

export const logChatToFirestore = async (
  { userProfile, userMessage, aiResponse }: ChatLogPayload,
  onError?: (error: unknown) => void
) => {
  try {
    // Get current user
    await auth.authStateReady()
    console.log('Auth state ready, current user:', auth.currentUser?.uid)
    const user = auth.currentUser
    if (!user) {
      throw new Error('User not authenticated')
    }
    const docRef = await addDoc(collection(db, CHAT_LOG_COLLECTION), {
      userProfile,
      userMessage,
      aiResponse,
      userId: user?.uid, // Add this
      timestamp: Timestamp.now(),
    })
    console.log('Chat log stored in Firestore with ID:', docRef.id)
    return docRef
  } catch (error) {
    console.error('Failed to log chat to Firestore:', error)
    if (onError) onError(error)
    throw error // Re-throw the error for handling in the calling code
  }
}
