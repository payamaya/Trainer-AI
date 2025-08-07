import { saveUserProfile } from '../../../services/UserProfileService'
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
    setUserProfile((prevProfile) => {
      // Use the updater function for safe state updates
      if (!prevProfile) return null
      return {
        ...prevProfile,
        [name]: name === 'age' ? parseInt(value) || 0 : value,
      }
    })
  }
  const handleGoalToggle = (goal: string) => {
    setUserProfile((prevProfile) => {
      if (!prevProfile) return null
      const updatedGoals = prevProfile.goals.includes(goal)
        ? prevProfile.goals.filter((g) => g !== goal)
        : [...prevProfile.goals, goal]
      return {
        ...prevProfile,
        goals: updatedGoals,
      }
    })
  }

  const submitProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userProfile) return // Prevent submission if profile is null

    const updatedProfile = { ...userProfile, completed: true }
    await saveUserProfile(updatedProfile) // Save the updated profile to Firestore

    setUserProfile(updatedProfile) // Update the parent state after a successful save
    setShowProfileForm(false)
  }

  return { handleProfileChange, handleGoalToggle, submitProfile }
}
