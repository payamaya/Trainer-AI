import type { GoogleUser } from '../../types/user'
import '../../styles/Avatar.css'
interface AvatarProps {
  googleUser?: GoogleUser
}
export const Avatar = ({ googleUser }: AvatarProps) => {
  return (
    <div className='ai-avatar' aria-hidden='true' role='presentation'>
      <img
        src={googleUser?.picture || '/default-avatar.png'}
        alt='AI Trainer Avatar'
        className='profile-img'
        width={48}
        height={48}
        loading='lazy'
      />
    </div>
  )
}
