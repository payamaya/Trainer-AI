import type { GoogleUser } from '../user/google-user'
import type { UserProfile } from '../user/user-profile'

export interface ChatInterfaceProps {
  userProfile: UserProfile
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile>>
  googleUser?: GoogleUser
  setShowProfileForm: (show: boolean) => void
}
