import type { GoogleUser } from '../../../types/user/google-user'

export interface NavbarProps {
  user: GoogleUser | null
  logout: () => void
}
