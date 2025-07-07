export interface UserProfile {
  name: string
  age: string
  gender: string
  height: string
  weight: string
  fitnessLevel: 'beginner' | 'intermediate' | 'advanced' | ''
  goals: string[]
  completed: boolean
  customAvatarUrl?: string
}

export interface AIChatProps {
  googleUser?: {
    name: string
    email: string
    picture?: string
  }
}
export interface Props {
  userProfile: UserProfile
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile>>
  setShowProfileForm: (show: boolean) => void
  googleUser?: AIChatProps['googleUser']
}
export interface ProfileFormProps {
  // Renamed from "Props" to be specific
  currentProfile: UserProfile // The profile data to edit (initial/saved)
  onSave: (profile: UserProfile) => void // Callback when the form is submitted
  onCancel: () => void // Callback when the form is cancelled
}

// Update WelcomeMessageProps
export interface WelcomeMessageProps {
  userProfile: UserProfile
  googleUser?: AIChatProps['googleUser']
  onEditProfile: (show: boolean) => void
  onAvatarChange: (newAvatarFile: File | null) => void // Add this
  editableAvatarUrl?: string // Add this (optional, for explicit URL if different from googleUser.picture)
}

// If your original `Props` interface was for ChatInterface, let's keep it that way
export interface ChatInterfaceProps {
  // Renamed from 'Props' to be more specific
  userProfile: UserProfile
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile>> // If ChatInterface needs to update it
  googleUser?: AIChatProps['googleUser']
  setShowProfileForm: (show: boolean) => void // To open/close profile form from ChatInterface
}
