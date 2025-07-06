'use client'
import { useState } from 'react'

import '../styles/AIChat.css'

import ProfileForm from './ProfileForm/ProfileForm'
import ChatInterface from './ChatInterface'
import type { AIChatProps, UserProfile } from '../types/interfaces'

const AIChat = ({ googleUser }: AIChatProps) => {
  const [showProfileForm, setShowProfileForm] = useState(true)
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: googleUser?.name || '',
    age: '',
    gender: '',
    height: '',
    weight: '',
    fitnessLevel: 'beginner',
    goals: [],
    completed: false,
  })

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
        <ChatInterface userProfile={userProfile} googleUser={googleUser} />
      )}
    </div>
  )
}

export default AIChat
