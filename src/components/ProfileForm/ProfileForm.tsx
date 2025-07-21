import React from 'react'

import { useProfileForm } from './hooks/useProfileForm'

import { TextInput, NumberInput, SelectInput } from './inputs'
import GoalsCheckboxGroup from './inputs/GoalsCheckboxGroup'

import './ProfileForm.css'
// import '../../styles/Vibration.css'
// import '../../styles/Avatar.css'
import type { Props } from '../../types/interfaces'
import Button from '../Button/ReusableButton'

const ProfileForm: React.FC<Props> = ({
  userProfile,
  setUserProfile,
  setShowProfileForm,
}) => {
  const {
    handleTextChange,
    handleGoalToggle,
    submitProfile,
    handleSelectChange,
    handleNumberChange,
  } = useProfileForm({ setUserProfile, setShowProfileForm })

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
        onChange={handleTextChange('name')}
        placeholder='Enter your name'
        required
      />

      <NumberInput
        label='Age'
        name='age'
        value={userProfile.age}
        onChange={handleNumberChange('age')}
        min={13}
        max={100}
        placeholder='Enter your age'
        required
      />

      <SelectInput
        label='Gender'
        name='gender'
        value={userProfile.gender}
        onChange={handleSelectChange('gender')}
        options={['male', 'female', 'other']}
        required
      />

      <NumberInput
        label='Height (cm)'
        name='height'
        value={parseInt(userProfile.height)}
        onChange={handleNumberChange('height')}
        min={100}
        max={250}
        placeholder='Enter your height'
        required
      />

      <NumberInput
        label='Weight (kg)'
        name='weight'
        value={parseInt(userProfile.weight)}
        onChange={handleNumberChange('weight')}
        min={30}
        max={200}
        placeholder='Enter your weight'
        required
      />

      <SelectInput
        label='Fitness Level'
        name='fitnessLevel'
        value={userProfile.fitnessLevel}
        onChange={handleSelectChange('fitnessLevel')}
        options={['beginner', 'intermediate', 'advanced']}
        required
      />

      <GoalsCheckboxGroup
        selectedGoals={userProfile.goals}
        onToggleGoal={handleGoalToggle}
      />

      <section className='btn-section'>
        <Button type='submit' variant='submit' fullWidth className='mt-4'>
          Submit Profile
        </Button>
      </section>
    </form>
  )
}

export default ProfileForm
