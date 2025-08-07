import { auth } from '../firebase'
import { signInWithCredential } from 'firebase/auth'
import { GoogleAuthProvider } from 'firebase/auth'
import { jwtDecode } from 'jwt-decode'
import { getUserProfile } from './UserProfileService'

export const authenticateWithFirebase = async (googleToken: string) => {
  try {
    // Method 1: Direct credential sign-in (recommended)
    const credential = GoogleAuthProvider.credential(googleToken)
    const userCredential = await signInWithCredential(auth, credential)

    // Method 2: Fallback to popup if needed
    // const userCredential = await signInWithPopup(auth, googleProvider);
    // Wait for auth state to be fully initialized
    await new Promise((resolve) => {
      const unsubscribe = auth.onAuthStateChanged((user) => {
        unsubscribe()
        resolve(user)
      })
    })
    const decoded = jwtDecode<{
      name: string
      email: string
      picture?: string
    }>(googleToken)
    // Check for existing profile
    let existingProfile = await getUserProfile()
    if (!existingProfile) {
      existingProfile = {
        name: decoded.name || '',
        email: decoded.email || '',
        age: '',
        gender: 'other',
        height: '',
        weight: '',
        fitnessLevel: 'beginner',
        goals: [],
        completed: false,
        photoURL: decoded.picture || '/default-avatar.png',
      }
    }
    return {
      firebaseUser: userCredential.user,
      googleUser: {
        name: decoded.name,
        email: decoded.email,
        picture: decoded.picture,
      },
      userProfile: existingProfile,
    }
  } catch (error) {
    console.error('Firebase auth error:', error)
    throw error
  }
}
