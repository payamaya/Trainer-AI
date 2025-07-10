import { auth } from '../firebase'
import { signInWithCredential, GoogleAuthProvider } from 'firebase/auth'
import { jwtDecode } from 'jwt-decode'

export const authenticateWithFirebase = async (googleToken: string) => {
  const credential = GoogleAuthProvider.credential(googleToken)
  try {
    // Sign into Firebase
    const userCredential = await signInWithCredential(auth, credential)

    // Get user info from the token
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
    console.error('Firebase authentication failed:', error)
    throw error
  }
}
