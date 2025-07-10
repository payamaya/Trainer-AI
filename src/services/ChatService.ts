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
    const user = auth.currentUser
    if (!user) {
      console.warn('Attempted to log chat, but no user is authenticated.')
      if (onError)
        onError(new Error('User not authenticated for chat logging.'))
      return // IMPORTANT: If no user, it stops here.
    }

    const docRef = await addDoc(collection(db, CHAT_LOG_COLLECTION), {
      userProfile,
      userMessage,
      aiResponse,
      userId: user.uid,
      timestamp: Timestamp.now(),
    })
    console.log('Chat log stored in Firestore with ID:', docRef.id)
    // return docRef
  } catch (error) {
    console.error('Failed to log chat to Firestore:', error)
    if (onError) onError(error)
    throw error
  }
}
