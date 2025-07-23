import type { UserProfile } from '../user/user-profile'

export interface ProfileFormProps {
  currentProfile: UserProfile
  onSave: (profile: UserProfile) => void
  onCancel: () => void
}
