import type { GoogleUser } from '../../../types'

export interface NavbarProps {
  user: GoogleUser | null
  logout: () => void
}
