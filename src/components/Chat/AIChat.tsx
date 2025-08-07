'use client'
import { useEffect, useState } from 'react'
import ProfileForm from '../ProfileForm/ProfileForm'
import './AIChat.css'
import type { AIChatProps } from '../../types/props/ai-chat-props'
import type { UserProfile } from '../../types/user/user-profile'
import { ChatInterface } from './ChatInterface'
import { onAuthStateChanged } from '@firebase/auth'
import { auth } from '../../firebase'
import { getUserProfile } from '../../services/UserProfileService'

const AIChat = ({ googleUser }: AIChatProps) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [showProfileForm, setShowProfileForm] = useState(true)
  const [authChecked, setAuthChecked] = useState(false)
  const [profileLoaded, setProfileLoaded] = useState(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Only fetch profile if a user is signed in
        const loadProfile = async () => {
          const savedProfile = await getUserProfile()
          if (savedProfile) {
            setUserProfile(savedProfile)
            setShowProfileForm(false)
          } else {
            // No saved profile, show the form with default data
            setUserProfile({
              userId: user.uid,
              name: googleUser?.name ?? 'Anonymous',
              age: '',
              gender: 'other',
              height: '',
              weight: '',
              fitnessLevel: 'beginner',
              goals: [],
              completed: false,
              customAvatarUrl: googleUser?.picture || '/default-avatar.png',
            })
            setShowProfileForm(true)
          }
          setProfileLoaded(true)
        }
        loadProfile()
      }
      setAuthChecked(true)
    })

    return () => unsubscribe()
  }, [googleUser]) // Depend on googleUser to run after it's available

  if (!authChecked || !profileLoaded) {
    return <div>Loading...</div>
  }

  if (!userProfile) {
    // This case should be rare if the logic above is correct, but handles a null state.
    return <div>Error loading profile.</div>
  }

  return (
    <div className='ai-chat-container'>
      {showProfileForm ? (
        <ProfileForm
          userProfile={userProfile}
          setUserProfile={setUserProfile}
          setShowProfileForm={setShowProfileForm}
          googleUser={googleUser}
        />
      ) : (
        <ChatInterface
          userProfile={userProfile}
          setUserProfile={setUserProfile}
          googleUser={googleUser}
          showProfileForm={showProfileForm}
          setShowProfileForm={setShowProfileForm}
        />
      )}
    </div>
  )
}

export default AIChat
