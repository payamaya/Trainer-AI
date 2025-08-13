import { initializeApp } from 'firebase/app'
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore'
import {
  browserLocalPersistence,
  getAuth,
  GoogleAuthProvider,
  GithubAuthProvider,
  setPersistence,
  connectAuthEmulator,
} from 'firebase/auth'
import { connectFunctionsEmulator, getFunctions } from 'firebase/functions'
// web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  vapidKey: import.meta.env.VITE_VAPID_API_KEY,
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)
const functions = getFunctions(app)

// Configure Google provider
const googleProvider = new GoogleAuthProvider()
googleProvider.setCustomParameters({
  prompt: 'select_account',
})
const githubProvider = new GithubAuthProvider()
// Set persistence
setPersistence(auth, browserLocalPersistence)
// ✅ Connect to emulators in development
if (window.location.hostname === 'localhost') {
  connectAuthEmulator(auth, 'http://127.0.0.1:9099')
  connectFirestoreEmulator(db, '127.0.0.1', 8080)
  connectFunctionsEmulator(functions, '127.0.0.1', 5001)
}
export { auth, db, googleProvider, githubProvider }
