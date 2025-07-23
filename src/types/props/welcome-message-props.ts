import type { AIChatProps } from './ai-chat-props'
import type { UserProfile } from '../user/user-profile'

export interface WelcomeMessageProps {
  userProfile: UserProfile
  googleUser?: AIChatProps['googleUser']
  onEditProfile: (show: boolean) => void
  onAvatarChange: (newAvatarFile: File | null) => void
  editableAvatarUrl?: string
}
