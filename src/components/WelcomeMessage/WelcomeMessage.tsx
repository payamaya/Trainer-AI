// components/WelcomeMessage.tsx
import React from 'react'
import type { AIChatProps, UserProfile } from '../../types/interfaces'
import './WelcomeMessage.css'
interface WelcomeMessageProps {
  userProfile: UserProfile
  googleUser?: AIChatProps['googleUser']
  onEditProfile: (show: boolean) => void // Prop to handle opening the edit profile form
}

const WelcomeMessage: React.FC<WelcomeMessageProps> = ({
  userProfile,
  googleUser,
  onEditProfile,
}) => {
  if (!userProfile.completed) {
    return null
  }

  return (
    <div className='user-profile-summary'>
      {googleUser?.picture && (
        <div className='ai-avatar' aria-hidden='true'>
          {/* This is the user's avatar, not the AI's */}
          <img
            src={googleUser.picture}
            alt={`${googleUser.name}'s profile`}
            className='user-profile-pic'
          />
        </div>
      )}
      <div className='profile-summary-content'>
        <h3>Welcome, {userProfile.name || googleUser?.name}!</h3>
        <p>Based on your profile:</p>
        <ul>
          <li>Age: {userProfile.age}</li>
          <li>Gender: {userProfile.gender} </li>
          <li>Height: {userProfile.height} cm</li>
          <li>Weight: {userProfile.weight} kg</li>
          <li>Fitness Level: {userProfile.fitnessLevel}</li>
          <li>Goals: {userProfile.goals.join(', ')}</li>
        </ul>
        <p>
          I'll provide personalized fitness advice. What would you like to know
          first?
        </p>
        <button
          onClick={() => onEditProfile(true)} // Use the passed-in prop
          className='edit-profile-button'
        >
          Edit Profile
        </button>
      </div>
    </div>
  )
}

export default WelcomeMessage
