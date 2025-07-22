'use client'
import { useState } from 'react'
import ProfileForm from '../ProfileForm/ProfileForm'
import ChatInterface from './ChatInterface'
import type { AIChatProps, UserProfile } from '../../types/interfaces'
import './AIChat.css'

const AIChat = ({ googleUser }: AIChatProps) => {
  const [showProfileForm, setShowProfileForm] = useState(true)
  const getDefaultProfile = (googleUser?: { name?: string }): UserProfile => ({
    name: googleUser?.name || '',
    age: 0,
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
