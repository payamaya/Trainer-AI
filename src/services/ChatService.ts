import { db } from '../firebase'
import { collection, addDoc, Timestamp } from 'firebase/firestore'
import type { UserProfile } from '../types/interfaces'

export const logChatToFirestore = async ({
  userProfile,
  userMessage,
  aiResponse,
}: {
  userProfile: UserProfile
  userMessage: string
  aiResponse: string
}) => {
  try {
    const docRef = await addDoc(collection(db, 'chatLogs'), {
      userProfile,
      userMessage,
      aiResponse,
      timestamp: Timestamp.now(),
    })
    console.log('Chat log stored in Firestore with ID:', docRef.id)
  } catch (error) {
    console.error('Failed to log chat to Firestore:', error)
  }
}
