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
  const handleProfileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target
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

  const submitProfile = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      setUserProfile((prev) => ({ ...prev, completed: true }))
      setShowProfileForm(false)
    },
    [setUserProfile, setShowProfileForm]
  )

  return { handleProfileChange, handleGoalToggle, submitProfile }
}
