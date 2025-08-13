/// <reference lib="webworker" />
export {}

import { initializeApp } from 'firebase/app'
import { getMessaging, onBackgroundMessage } from 'firebase/messaging/sw'

const firebaseApp = initializeApp({
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
})

const messaging = getMessaging(firebaseApp)

onBackgroundMessage(messaging, (payload) => {
  console.log('[firebase-messaging-sw.js] Background message:', payload)

  const { title, body } = payload.notification || {}
  ;(self as unknown as ServiceWorkerGlobalScope).registration.showNotification(
    title || 'New Notification',
    {
      body: body || '',
      icon: '/firebase-logo.png',
    }
  )
})
