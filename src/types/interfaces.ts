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
  currentProfile: UserProfile
  onSave: (profile: UserProfile) => void
  onCancel: () => void
}

// Update WelcomeMessageProps
export interface WelcomeMessageProps {
  userProfile: UserProfile
  googleUser?: AIChatProps['googleUser']
  onEditProfile: (show: boolean) => void
  onAvatarChange: (newAvatarFile: File | null) => void
  editableAvatarUrl?: string
}

export interface ChatInterfaceProps {
  userProfile: UserProfile
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile>>
  googleUser?: AIChatProps['googleUser']
  setShowProfileForm: (show: boolean) => void
}
