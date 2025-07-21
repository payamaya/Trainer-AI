import type { UserProfile } from '../../../types/interfaces'
import { useCallback } from 'react'

interface UseProfileFormProps {
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile>>
  setShowProfileForm: (show: boolean) => void
}

export const useProfileForm = ({
  setUserProfile,
  setShowProfileForm,
}: UseProfileFormProps) => {
  const handleTextChange = useCallback(
    (name: keyof UserProfile) => (value: string) => {
      setUserProfile((prev) => ({
        ...prev,
        [name]: value,
      }))
    },
    [setUserProfile]
  )

  // Special handler for number inputs
  const handleNumberChange = useCallback(
    (name: keyof UserProfile) => (value: number | '') => {
      setUserProfile((prev) => ({
        ...prev,
        [name]: value,
      }))
    },
    [setUserProfile]
  )

  const handleGoalToggle = useCallback(
    (goal: string) => {
      setUserProfile((prev) => {
        const newGoals = prev.goals.includes(goal)
          ? prev.goals.filter((g) => g !== goal)
          : [...prev.goals, goal]
        return { ...prev, goals: newGoals }
      })
    },
    [setUserProfile]
  )

  // Handler for select inputs
  const handleSelectChange = useCallback(
    (name: keyof UserProfile) => (e: React.ChangeEvent<HTMLSelectElement>) => {
      setUserProfile((prev) => ({
        ...prev,
        [name]: e.target.value,
      }))
    },
    [setUserProfile]
  )
  const submitProfile = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      setUserProfile((prev) => ({ ...prev, completed: true }))
      setShowProfileForm(false)
    },
    [setUserProfile, setShowProfileForm]
  )

  return {
    handleTextChange,
    handleGoalToggle,
    submitProfile,
    handleNumberChange,
    handleSelectChange,
  }
}
