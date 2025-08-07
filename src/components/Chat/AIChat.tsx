'use client'
import { useEffect, useState } from 'react'
import ProfileForm from '../ProfileForm/ProfileForm'
import './AIChat.css'
import type { AIChatProps } from '../../types/props/ai-chat-props'
import type { UserProfile } from '../../types/user/user-profile'
import { ChatInterface } from './ChatInterface'
import { onAuthStateChanged } from '@firebase/auth'
import { auth } from '../../firebase'

const AIChat = ({ googleUser }: AIChatProps) => {
  const [userProfile, setUserProfile] = useState<UserProfile>({
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
  const [showProfileForm, setShowProfileForm] = useState(true)
  const [authChecked, setAuthChecked] = useState(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in
        setShowProfileForm(false)
      }
      setAuthChecked(true)
    })

    return () => unsubscribe()
  }, [])

  if (!authChecked) {
    return <div>Loading...</div>
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
          initialUserProfile={userProfile}
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
