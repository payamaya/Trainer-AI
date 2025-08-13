import * as functions from 'firebase-functions/v2'
import * as admin from 'firebase-admin'
import { onSchedule } from 'firebase-functions/v2/scheduler'

admin.initializeApp()

exports.sendWelcomeNotification = functions.https.onCall(async (request) => {
  const { auth, data } = request
  const userId = data.userId

  if (!auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'User must be authenticated to call this function.'
    )
  }
  if (!userId) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'User ID is required.'
    )
  }

  try {
    // 1. Fetch the user's FCM token from Firestore
    const userDoc = await admin
      .firestore()
      .collection('userTokens')
      .doc(userId)
      .get()
    const fcmToken = userDoc.data()?.token

    if (fcmToken) {
      // 2. Create the notification payload
      const payload = {
        notification: {
          title: '👋 Welcome to Trainer AI!',
          body: 'We are excited to have you on board. Start your fitness journey now!',
        },
        token: fcmToken,
      }

      // 3. Send the notification via FCM
      await admin.messaging().send(payload)
      console.log('Successfully sent welcome notification via FCM.')
    } else {
      console.warn(
        `FCM token not found for user: ${userId}. Notification will not be sent.`
      )
    }

    return { success: true }
  } catch (error) {
    console.error('Error sending welcome notification:', error)
    throw new functions.https.HttpsError('internal', 'Internal Server Error.')
  }
})

// Scheduled function to send a daily message every day at 9:00 AM
// Using the new v2 scheduled function syntax
exports.sendDailyMessage = onSchedule('0 9 * * *', async (event) => {
  console.log('Daily message scheduled function running...')

  const usersSnapshot = await admin.firestore().collection('userProfiles').get()

  const promises = usersSnapshot.docs.map(async (doc) => {
    const userId = doc.id
    await admin.firestore().collection('notifications').add({
      userId: userId,
      message: "Good morning! Ready for today's workout?",
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      read: false,
    })
  })

  await Promise.all(promises)
  console.log('Daily messages sent to all users.')
  // return null
})
