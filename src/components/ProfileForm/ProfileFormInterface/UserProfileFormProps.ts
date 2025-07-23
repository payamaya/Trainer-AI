import type { UserProfile } from '../../../types/user/user-profile'

export interface UseProfileFormProps {
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile>>
  setShowProfileForm: (show: boolean) => void
}
