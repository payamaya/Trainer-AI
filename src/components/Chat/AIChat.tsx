'use client'
import { useState } from 'react'
import ProfileForm from '../ProfileForm/ProfileForm'

import './AIChat.css'
import type { AIChatProps } from '../../types/props/ai-chat-props'
import type { UserProfile } from '../../types/user/user-profile'
import { ChatInterface } from './ChatInterface'

const AIChat = ({ googleUser }: AIChatProps) => {
  const [showProfileForm, setShowProfileForm] = useState(true)
  const getDefaultProfile = (googleUser?: { name?: string }): UserProfile => ({
    name: googleUser?.name || '',
    age: '',
    gender: 'other',
    height: '',
    weight: '',
    fitnessLevel: 'beginner',
    goals: [],
    completed: false,
  })

  const [userProfile, setUserProfile] = useState<UserProfile>(
    getDefaultProfile(googleUser)
  )

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
          googleUser={googleUser}
          setShowProfileForm={setShowProfileForm}
        />
      )}
    </div>
  )
}

export default AIChat
