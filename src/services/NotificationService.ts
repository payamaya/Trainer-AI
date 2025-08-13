import { getFunctions, httpsCallable } from 'firebase/functions'
import { getApp } from 'firebase/app'

// Initialize the functions SDK from your Firebase app instance
const functions = getFunctions(getApp())

// Define the callable function name
const sendWelcomeNotification = httpsCallable(
  functions,
  'sendWelcomeNotification'
)

/**
 * Calls the Cloud Function to send a welcome notification to the user.
 * @param userId The ID of the user to send the notification to.
 */
export const triggerWelcomeNotification = async (userId: string) => {
  try {
    const result = await sendWelcomeNotification({ userId: userId })
    console.log(
      result.data,
      'Successfully triggered welcome notification for user:',
      userId
    )
  } catch (error) {
    console.error('Failed to trigger welcome notification:', error)
  }
}
