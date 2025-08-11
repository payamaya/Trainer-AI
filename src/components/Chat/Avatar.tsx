import type { GoogleUser } from '../../types/user'
import '../../styles/Avatar.css'
import defaultAvatar from '../../../public/default-avatar.png'
import maleAvatar from '../../../public/male-avatar.jpg'
import femaleAvatar from '../../../public/female-avatar.jpg'
interface AvatarProps {
  googleUser?: GoogleUser
  gender?: string
  size?: number
  className?: string
}
export const Avatar = ({
  googleUser,
  gender,
  size = 80,
  className,
}: AvatarProps) => {
  let imgSrc = googleUser?.picture || defaultAvatar

  // Use the gender prop to override the default avatar if it's not a Google user
  if (!googleUser?.picture) {
    if (gender === 'male') {
      imgSrc = maleAvatar
    } else if (gender === 'female') {
      imgSrc = femaleAvatar
    }
  }

  return (
    <div
      className={`ai-avatar ${className || ''}`}
      aria-hidden='true'
      role='presentation'
    >
      <img
        // src={googleUser?.picture || '/default-avatar.png'}
        // alt={
        //   googleUser?.name ? `${googleUser.name}'s avatar` : 'Default avatar'
        // }
        src={imgSrc}
        alt={googleUser?.name ? `${googleUser.name}'s avatar` : 'User avatar'}
        className='profile-img'
        width={size}
        height={size}
        loading='lazy'
      />
    </div>
  )
}
