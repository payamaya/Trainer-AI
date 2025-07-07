// import React, { type FormEvent } from 'react'
// import type { AIChatProps, UserProfile } from '../../types/interfaces'
// import '../styles/AIChat.css'
// import '../styles/Vibration.css'
// import '../styles/Avatar.css'
// interface Props {
//   userProfile: UserProfile
//   setUserProfile: React.Dispatch<React.SetStateAction<UserProfile>>
//   setShowProfileForm: (show: boolean) => void
//   googleUser?: AIChatProps['googleUser']
// }

// const goalsList = [
//   'Weight Loss',
//   'Muscle Gain',
//   'Cardio Endurance',
//   'Flexibility',
//   'Rehabilitation',
//   'Nutrition Guidance',
// ]

// const ProfileForm = ({
//   userProfile,
//   setUserProfile,
//   setShowProfileForm,
// }: Props) => {
//   const handleProfileChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
//   ) => {
//     const { name, value } = e.target
//     setUserProfile((prev) => ({
//       ...prev,
//       [name]: value,
//     }))
//   }

//   const handleGoalToggle = (goal: string) => {
//     setUserProfile((prev) => {
//       const newGoals = prev.goals.includes(goal)
//         ? prev.goals.filter((g) => g !== goal)
//         : [...prev.goals, goal]
//       return { ...prev, goals: newGoals }
//     })
//   }

//   const submitProfile = (e: FormEvent) => {
//     e.preventDefault()
//     setUserProfile((prev) => ({ ...prev, completed: true }))
//     setShowProfileForm(false)
//   }

//   return (
//     <form onSubmit={submitProfile} className='profile-form'>
//       <h2 className='form-header'>
//         Complete Your Profile for Personalized AI Training
//         <span className='form-subheader'>
//           The more details you provide, the better your AI trainer can customize
//           workouts, nutrition plans, and form corrections specifically for you.
//         </span>
//       </h2>

//       <div className='form-group'>
//         <label>Name</label>
//         <input
//           type='text'
//           name='name'
//           value={userProfile.name}
//           onChange={handleProfileChange}
//           required
//           placeholder='Enter your name'
//         />
//       </div>

//       <div className='form-group'>
//         <label>Age</label>
//         <input
//           type='number'
//           name='age'
//           value={userProfile.age}
//           onChange={handleProfileChange}
//           required
//           min='13'
//           max='100'
//           placeholder='Enter your age'
//         />
//       </div>

//       <div className='form-group'>
//         <label>Gender</label>
//         <select
//           name='gender'
//           value={userProfile.gender}
//           onChange={handleProfileChange}
//           required
//         >
//           <option value=''>Select</option>
//           <option value='male'>Male</option>
//           <option value='female'>Female</option>
//           <option value='other'>Other</option>
//         </select>
//       </div>

//       <div className='form-group'>
//         <label>Height (cm)</label>
//         <input
//           type='number'
//           name='height'
//           value={userProfile.height}
//           onChange={handleProfileChange}
//           required
//           min='100'
//           max='250'
//           placeholder='Enter your height'
//         />
//       </div>

//       <div className='form-group'>
//         <label>Weight (kg)</label>
//         <input
//           type='number'
//           name='weight'
//           value={userProfile.weight}
//           onChange={handleProfileChange}
//           required
//           min='30'
//           max='200'
//           placeholder='Enter your weight'
//         />
//       </div>

//       <div className='form-group'>
//         <label>Fitness Level</label>
//         <select
//           name='fitnessLevel'
//           value={userProfile.fitnessLevel}
//           onChange={handleProfileChange}
//           required
//         >
//           <option value='beginner'>Beginner</option>
//           <option value='intermediate'>Intermediate</option>
//           <option value='advanced'>Advanced</option>
//         </select>
//       </div>

//       <div className='form-group'>
//         <fieldset className='goals-fieldset'>
//           <legend className='select-label'>Fitness Goals</legend>
//           <div className='goal-options'>
//             {goalsList.map((goal) => (
//               <label key={goal} className='goal-checkbox'>
//                 <input
//                   type='checkbox'
//                   checked={userProfile.goals.includes(goal)}
//                   onChange={() => handleGoalToggle(goal)}
//                 />
//                 {goal}
//               </label>
//             ))}
//             <button type='submit' className='submit-profile'>
//               {/* Moved here, directly under form */}
//               Submit Profile
//             </button>
//           </div>
//         </fieldset>
//       </div>
//     </form>
//   )
// }

// export default ProfileForm
import React from 'react'

import { useProfileForm } from './hooks/useProfileForm'
import TextInput from './inputs/TextInput'
import NumberInput from './inputs/NumberInput'
import SelectInput from './inputs/SelectInput'
import GoalsCheckboxGroup from './inputs/GoalsCheckboxGroup'

import '../Chat/AIChat.css'
import '../../styles/Vibration.css'
import '../../styles/Avatar.css'
import type { Props } from '../../types/interfaces'

const ProfileForm: React.FC<Props> = ({
  userProfile,
  setUserProfile,
  setShowProfileForm,
}) => {
  const { handleProfileChange, handleGoalToggle, submitProfile } =
    useProfileForm({ setUserProfile, setShowProfileForm })

  return (
    <form onSubmit={submitProfile} className='profile-form'>
      <h2 className='form-header'>
        Complete Your Profile for Personalized AI Training
        <span className='form-subheader'>
          The more details you provide, the better your AI trainer can customize
          workouts, nutrition plans, and form corrections specifically for you.
        </span>
      </h2>

      <TextInput
        label='Name'
        name='name'
        value={userProfile.name}
        onChange={handleProfileChange}
        placeholder='Enter your name'
        required
      />

      <NumberInput
        label='Age'
        name='age'
        value={parseInt(userProfile.age)}
        onChange={handleProfileChange}
        min={13}
        max={100}
        placeholder='Enter your age'
        required
      />

      <SelectInput
        label='Gender'
        name='gender'
        value={userProfile.gender}
        onChange={handleProfileChange}
        options={['male', 'female', 'other']}
        required
      />

      <NumberInput
        label='Height (cm)'
        name='height'
        value={parseInt(userProfile.height)}
        onChange={handleProfileChange}
        min={100}
        max={250}
        placeholder='Enter your height'
        required
      />

      <NumberInput
        label='Weight (kg)'
        name='weight'
        value={parseInt(userProfile.weight)}
        onChange={handleProfileChange}
        min={30}
        max={200}
        placeholder='Enter your weight'
        required
      />

      <SelectInput
        label='Fitness Level'
        name='fitnessLevel'
        value={userProfile.fitnessLevel}
        onChange={handleProfileChange}
        options={['beginner', 'intermediate', 'advanced']}
        required
      />

      <GoalsCheckboxGroup
        selectedGoals={userProfile.goals}
        onToggleGoal={handleGoalToggle}
      />

      <button type='submit' className='submit-profile'>
        Submit Profile
      </button>
    </form>
  )
}

export default ProfileForm
