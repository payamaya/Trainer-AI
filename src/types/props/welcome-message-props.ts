import type { UserProfile } from '../user/user-profile'
import type { GoogleUser } from '../user/google-user'

export interface WelcomeMessageProps {
  userProfile: UserProfile
  googleUser?: GoogleUser
  onEditProfile: (show: boolean) => void
  onAvatarChange: (newAvatarFile: File | null) => void
  editableAvatarUrl?: string
}
