import type { GoogleUser } from '../user/google-user'
import type { UserProfile } from '../user/user-profile'

export interface WelcomeMessageProps {
  userProfile: UserProfile
  googleUser?: GoogleUser
  onEditProfile: (show: boolean) => void
  onAvatarChange: (newAvatarFile: File | null) => void
  editableAvatarUrl?: string
}
