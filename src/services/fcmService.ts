// src/services/fcmService.ts
import { getMessaging, getToken } from 'firebase/messaging'
import { doc, setDoc } from 'firebase/firestore'
import { db } from '../firebase' // Assuming you have a file that exports your db instance

// Function to get and save the FCM token
export const saveFCMToken = async (userId: string) => {
  const messaging = getMessaging()
  try {
    const token = await getToken(messaging, {
      // Your VAPID key is a long string from your Firebase project settings
      vapidKey: import.meta.env.VITE_VAPID_API_KEY,
    })
    console.log('FCM token:', token)
    if (token) {
      // Save the token to Firestore
      const tokenDocRef = doc(db, 'userTokens', userId)
      await setDoc(tokenDocRef, { token, createdAt: new Date() })
      console.log('FCM token saved for user:', userId)
    }
  } catch (error) {
    console.error('An error occurred while retrieving the token. ', error)
  }
}
