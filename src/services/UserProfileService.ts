import { db, auth } from '../firebase'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import type { UserProfile } from '../types/user/user-profile'

const USER_PROFILES_COLLECTION = 'userProfiles'

export const saveUserProfile = async (profile: UserProfile) => {
  const user = auth.currentUser
  if (!user) throw new Error('User not authenticated')

  try {
    await setDoc(doc(db, USER_PROFILES_COLLECTION, user.uid), {
      ...profile,
      userId: user.uid, // Add user ID to document
      lastUpdated: new Date(),
    })
  } catch (error) {
    console.error('Error saving profile:', error)
    throw error
  }
}

export const getUserProfile = async (): Promise<UserProfile | null> => {
  const user = auth.currentUser
  if (!user) return null

  try {
    const docRef = doc(db, USER_PROFILES_COLLECTION, user.uid)
    const docSnap = await getDoc(docRef)

    return docSnap.exists() ? (docSnap.data() as UserProfile) : null
  } catch (error) {
    console.error('Error getting profile:', error)
    return null
  }
}
