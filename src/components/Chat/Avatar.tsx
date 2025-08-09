import type { GoogleUser } from '../../types/user'
import '../../styles/Avatar.css'
interface AvatarProps {
  googleUser?: GoogleUser
  size?: number
  className?: string
}
export const Avatar = ({ googleUser, size = 80, className }: AvatarProps) => {
  return (
    <div
      className={`ai-avatar ${className || ''}`}
      aria-hidden='true'
      role='presentation'
    >
      <img
        src={googleUser?.picture || '/default-avatar.png'}
        alt={
          googleUser?.name ? `${googleUser.name}'s avatar` : 'Default avatar'
        }
        className='profile-img'
        width={size}
        height={size}
        loading='lazy'
      />
    </div>
  )
}
