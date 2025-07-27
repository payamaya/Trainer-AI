'use client'
import { useState } from 'react'
import ProfileForm from '../ProfileForm/ProfileForm'

import './AIChat.css'
import type { AIChatProps } from '../../types/props/ai-chat-props'
import type { UserProfile } from '../../types/user/user-profile'
import { ChatInterface } from './ChatInterface'

const AIChat = ({ googleUser }: AIChatProps) => {
  const [showProfileForm, setShowProfileForm] = useState(true)

  const getDefaultProfile = (googleUser?: { name?: string }): UserProfile => {
    return {
      name: googleUser?.name ?? 'Anonymous',
      age: 18, // ✅ Must be a positive integer
      gender: 'other',
      height: '170', // ✅ At least 1 character
      weight: '70', // ✅ At least 1 character
      fitnessLevel: 'beginner',
      goals: ['get fit'], // ✅ At least one goal with min 1 char
      completed: false,
      customAvatarUrl: '/default-avatar.png', // optional, can be removed
    }
  }

  const profile = getDefaultProfile(googleUser) as UserProfile
  const [userProfile, setUserProfile] = useState<UserProfile>(profile)

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
