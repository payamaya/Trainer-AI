'use client'
import { useState } from 'react'
import ProfileForm from '../ProfileForm/ProfileForm'
import './AIChat.css'
import type { AIChatProps } from '../../types/props/ai-chat-props'
import type { UserProfile } from '../../types/user/user-profile'
import { ChatInterface } from './ChatInterface'

const AIChat = ({ googleUser }: AIChatProps) => {
  const getDefaultProfile = (googleUser?: { name?: string }): UserProfile => ({
    name: googleUser?.name ?? 'Anonymous',
    age: 18,
    gender: 'other',
    height: '170',
    weight: '70',
    fitnessLevel: 'beginner',
    goals: ['get fit'],
    completed: false,
    customAvatarUrl: '/default-avatar.png',
  })

  const [userProfile, setUserProfile] = useState<UserProfile>(
    getDefaultProfile(googleUser)
  )
  const [showProfileForm, setShowProfileForm] = useState(true)

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
