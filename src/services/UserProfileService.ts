// src/services/UserProfileService.ts
import { db, auth } from '../firebase'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import type { UserProfile } from '../types/user/user-profile'

const USER_PROFILES_COLLECTION = 'userProfiles'

export const saveUserProfile = async (profile: UserProfile) => {
  const user = auth.currentUser
  if (!user) throw new Error('User not authenticated')

  await setDoc(doc(db, USER_PROFILES_COLLECTION, user.uid), {
    ...profile,
    lastUpdated: new Date(),
  })
}

export const getUserProfile = async (): Promise<UserProfile | null> => {
  const user = auth.currentUser
  if (!user) return null

  const docRef = doc(db, USER_PROFILES_COLLECTION, user.uid)
  const docSnap = await getDoc(docRef)

  if (docSnap.exists()) {
    return docSnap.data() as UserProfile
  }
  return null
}
