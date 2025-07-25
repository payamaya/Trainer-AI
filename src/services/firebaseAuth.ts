import { auth } from '../firebase'
import { signInWithCredential } from 'firebase/auth'
import { GoogleAuthProvider } from 'firebase/auth'
import { jwtDecode } from 'jwt-decode'

export const authenticateWithFirebase = async (googleToken: string) => {
  try {
    // Method 1: Direct credential sign-in (recommended)
    const credential = GoogleAuthProvider.credential(googleToken)
    const userCredential = await signInWithCredential(auth, credential)

    // Method 2: Fallback to popup if needed
    // const userCredential = await signInWithPopup(auth, googleProvider);

    const decoded = jwtDecode<{
      name: string
      email: string
      picture?: string
    }>(googleToken)

    return {
      firebaseUser: userCredential.user,
      googleUser: {
        name: decoded.name,
        email: decoded.email,
        picture: decoded.picture,
      },
    }
  } catch (error) {
    console.error('Firebase auth error:', error)
    throw error
  }
}
