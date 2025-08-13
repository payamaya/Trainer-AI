import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { GoogleOAuthProvider } from '@react-oauth/google'

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <App />
    </GoogleOAuthProvider>
  </StrictMode>
)
// Register Firebase Messaging SW
if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/firebase-messaging-sw.js', { type: 'module' })
    .then((registration) => {
      console.log('Service Worker registered with scope:', registration.scope)
    })
    .catch((error) => {
      console.error('Service Worker registration failed:', error)
    })
}
