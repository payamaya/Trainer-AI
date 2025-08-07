import { type UserProfile } from '../../../types/user/user-profile'
import React from 'react' // Import React for event types

interface UseProfileFormProps {
  userProfile: UserProfile // ADD THIS PROP
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile | null>>
  setShowProfileForm: (show: boolean) => void
}

export const useProfileForm = ({
  userProfile, // DESTRUCTURE THIS PROP
  setUserProfile,
  setShowProfileForm,
}: UseProfileFormProps) => {
  const handleProfileChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    // Calculate the new profile object based on the current userProfile from props
    const updatedProfile = {
      ...userProfile, // Start with the current profile
      [name]: name === 'age' ? parseInt(value) || 0 : value, // Convert age to number
    }
    // Pass the complete updated object to setUserProfile
    setUserProfile(updatedProfile)
  }

  const handleGoalToggle = (goal: string) => {
    const updatedGoals = userProfile.goals.includes(goal)
      ? userProfile.goals.filter((g) => g !== goal)
      : [...userProfile.goals, goal]

    // Pass the complete updated object to setUserProfile
    setUserProfile({
      ...userProfile,
      goals: updatedGoals,
    })
  }

  const submitProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    // Pass the current userProfile (from props) with completed: true
    await setUserProfile({
      ...userProfile, // Use the current profile state
      completed: true,
    })
    setShowProfileForm(false)
  }

  return { handleProfileChange, handleGoalToggle, submitProfile }
}
