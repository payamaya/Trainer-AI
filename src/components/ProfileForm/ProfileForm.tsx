import React from 'react'

import { useProfileForm } from './hooks/useProfileForm'
import TextInput from './inputs/TextInput'
import NumberInput from './inputs/NumberInput'
import SelectInput from './inputs/SelectInput'
import GoalsCheckboxGroup from './inputs/GoalsCheckboxGroup/GoalsCheckboxGroup'

import type { ChatInterfaceProps } from '../../types/props'
import '../Chat/AIChat.css'

const ProfileForm: React.FC<ChatInterfaceProps> = ({
  userProfile,
  setUserProfile,
  setShowProfileForm,
}) => {
  const { handleProfileChange, handleGoalToggle, submitProfile } =
    useProfileForm({ setUserProfile, setShowProfileForm })

  return (
    <form onSubmit={submitProfile} className='profile-form'>
      <h2 className='form-header'>
        Complete Your Profile for Personalized AI Training
        <span className='form-subheader'>
          The more details you provide, the better your AI trainer can customize
          workouts, nutrition plans, and form corrections specifically for you.
        </span>
      </h2>

      <TextInput
        label='Name'
        name='name'
        value={userProfile.name}
        onChange={handleProfileChange}
        placeholder='Enter your name'
        autoComplete='given-name'
        required
      />

      <NumberInput
        label='Age'
        name='age'
        value={userProfile.age}
        onChange={handleProfileChange}
        placeholder='Enter your age'
        autoComplete='off'
        min={13}
        max={100}
        required
      />

      <SelectInput
        label='Gender'
        name='gender'
        value={userProfile.gender}
        onChange={handleProfileChange}
        options={['male', 'female', 'other']}
        autoComplete='off'
        required
      />

      <NumberInput
        label='Height (cm)'
        name='height'
        value={parseInt(userProfile.height)}
        onChange={handleProfileChange}
        min={120}
        max={250}
        placeholder='Enter your height'
        required
        autoComplete='off'
      />

      <NumberInput
        label='Weight (kg)'
        name='weight'
        value={parseInt(userProfile.weight)}
        onChange={handleProfileChange}
        min={40}
        max={200}
        placeholder='Enter your weight'
        required
        autoComplete='off'
      />

      <SelectInput
        label='Fitness Level'
        name='fitnessLevel'
        value={userProfile.fitnessLevel}
        onChange={handleProfileChange}
        options={['beginner', 'intermediate', 'advanced']}
        required
        autoComplete='off'
      />

      <GoalsCheckboxGroup
        selectedGoals={userProfile.goals}
        onToggleGoal={handleGoalToggle}
      />

      <button type='submit' className='submit-profile'>
        Submit Profile
      </button>
    </form>
  )
}

export default ProfileForm
