import type { GoogleUser } from '../../types/user/google-user'
import type { UserProfile } from '../../types/user/user-profile'
import ChangePasswordForm from '../Auth/ChangePasswordForm'
import { Avatar } from '../Chat/Avatar'
import './WelcomeMessage.css'

type WelcomeMessageProps = {
  googleUser?: GoogleUser
  onEditProfile: () => void
  loading?: boolean
} & Pick<
  UserProfile,
  | 'name'
  | 'age'
  | 'gender'
  | 'height'
  | 'weight'
  | 'fitnessLevel'
  | 'goals'
  | 'completed'
>

export const WelcomeMessage = ({
  completed,
  name,
  age,
  gender,
  height,
  weight,
  fitnessLevel,
  goals,
  googleUser,
  onEditProfile,
  loading = false, // Default to false
}: WelcomeMessageProps) => {
  if (!completed) return null

  const displayName = name || googleUser?.name || 'User'

  // Improved goals display logic
  const nonEmptyGoals = goals?.filter((goal) => goal.trim() !== '') || []
  const formattedGoals = loading
    ? 'Loading goals...'
    : nonEmptyGoals.length > 0
      ? nonEmptyGoals.join(', ')
      : 'No goals set'

  return (
    <section className='user-profile-summary' aria-labelledby='welcome-heading'>
      <div className='user-avatar'>
        <Avatar googleUser={googleUser} size={80} />
      </div>

      <div className='profile-summary-content'>
        <h3 id='welcome-heading'>Welcome, {displayName}!</h3>
        <div className='profile-details'>
          <h4>Your Profile Details:</h4>
          <dl className='profile-details-grid'>
            <div className='detail-item'>
              <dt>Age</dt>
              <dd>{age}</dd>
            </div>
            <div className='detail-item'>
              <dt>Gender</dt>
              <dd>{gender}</dd>
            </div>
            <div className='detail-item'>
              <dt>Height</dt>
              <dd>{height} cm</dd>
            </div>
            <div className='detail-item'>
              <dt>Weight</dt>
              <dd>{weight} kg</dd>
            </div>
            <div className='detail-item'>
              <dt>Fitness Level</dt>
              <dd className='capitalize'>{fitnessLevel}</dd>
            </div>
          </dl>

          <div className='goals-section'>
            <h5>Your Goals:</h5>
            <p className={nonEmptyGoals.length === 0 ? 'no-goals' : ''}>
              {formattedGoals}
            </p>
          </div>
          <button
            onClick={onEditProfile}
            className='edit-profile-button'
            aria-label='Edit your profile'
          >
            Edit Profile
          </button>
        </div>

        <div className='welcome-message'>
          <p>
            I'll provide personalized fitness advice. What would you like to
            know first?
          </p>
        </div>
      </div>
      <ChangePasswordForm />
    </section>
  )
}
