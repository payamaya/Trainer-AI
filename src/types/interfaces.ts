export interface UserProfile {
  name: string
  age: string
  gender: string
  height: string
  weight: string
  fitnessLevel: 'beginner' | 'intermediate' | 'advanced'
  goals: string[]
  completed: boolean
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
