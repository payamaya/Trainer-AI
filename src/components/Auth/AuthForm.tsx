// 'use client'
// import React, { useState } from 'react'

// interface AuthFormProps {
//   formType: 'login' | 'signup'
//   onSubmit: (email: string, password: string) => Promise<void>
//   loading?: boolean
//   error?: string | null
//   message?: string | null
// }

// const AuthForm: React.FC<AuthFormProps> = ({
//   formType,
//   onSubmit,
//   loading,
//   error,
//   message,
// }) => {
//   const [email, setEmail] = useState('')
//   const [password, setPassword] = useState('')

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     await onSubmit(email, password)
//   }

//   const isLogin = formType === 'login'

//   return (
//     <form onSubmit={handleSubmit}>
//       <h2>{isLogin ? 'Log In' : 'Sign Up'}</h2>
//       <input
//         type='email'
//         id='email'
//         name='email'
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//         placeholder='Email'
//         required
//         autoComplete='email'
//       />
//       <input
//         type='password'
//         id='password'
//         name='password'
//         value={password}
//         onChange={(e) => setPassword(e.target.value)}
//         placeholder='Password'
//         required
//         autoComplete={isLogin ? 'current-password' : 'new-password'}
//       />
//       <button type='submit' disabled={loading}>
//         {loading ? 'Processing...' : isLogin ? 'Log In' : 'Sign Up'}
//       </button>
//       {message && <p className='success-message'>{message}</p>}
//       {error && <p className='error-message'>{error}</p>}
//       {isLogin && (
//         <p className='forgot-password-link'>
//           Forgot your password? <a href='/forgot-password'>Reset it</a>
//         </p>
//       )}
//     </form>
//   )
// }

// export default AuthForm

// components/Auth/AuthForm.tsx
// import React, { useState } from 'react'
// import { Link } from 'react-router-dom'
// import TextInput from '../ProfileForm/inputs/TextInput'
// // import './ForgotPassword.css'
// // import './ChangePasswordForm.css'

// interface AuthFormProps {
//   formType: 'login' | 'signup' | 'forgotPassword' | 'changePassword'
//   onSubmit: (data: { [key: string]: string }) => Promise<void>
//   loading?: boolean
//   error?: string | null
//   message?: string | null
//   className?: string
// }

// const AuthForm: React.FC<AuthFormProps> = ({
//   formType,
//   onSubmit,
//   loading,
//   error,
//   message,
// }) => {
//   const [email, setEmail] = useState('')
//   const [password, setPassword] = useState('')
//   const [currentPassword, setCurrentPassword] = useState('')
//   const [newPassword, setNewPassword] = useState('')
//   const [confirmNewPassword, setConfirmNewPassword] = useState('')

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()

//     // Create a data object with the relevant fields for the specific form type
//     const formData: { [key: string]: string } = {}
//     if (
//       formType === 'login' ||
//       formType === 'signup' ||
//       formType === 'forgotPassword'
//     ) {
//       formData.email = email
//     }
//     if (formType === 'login' || formType === 'signup') {
//       formData.password = password
//     }
//     if (formType === 'changePassword') {
//       formData.currentPassword = currentPassword
//       formData.newPassword = newPassword
//       formData.confirmNewPassword = confirmNewPassword
//     }

//     await onSubmit(formData)
//   }

//   const getTitle = () => {
//     switch (formType) {
//       case 'login':
//         return 'Log In'
//       case 'signup':
//         return 'Sign Up'
//       case 'forgotPassword':
//         return 'Reset Your Password'
//       case 'changePassword':
//         return 'Change Password'
//     }
//   }

//   const getButtonText = () => {
//     if (loading) {
//       return 'Processing...'
//     }
//     switch (formType) {
//       case 'login':
//         return 'Log In'
//       case 'signup':
//         return 'Sign Up'
//       case 'forgotPassword':
//         return 'Send Reset Email'
//       case 'changePassword':
//         return 'Update Password'
//     }
//   }

//   const renderInputs = () => {
//     switch (formType) {
//       case 'login':
//       case 'signup':
//         return (
//           <>
//             <TextInput
//               label='Email'
//               name='email'
//               type='email'
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               placeholder='Email'
//               required
//               autoComplete='email'
//             />
//             <TextInput
//               label='Password'
//               name='password'
//               type='password'
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               placeholder='Password'
//               required
//               autoComplete={
//                 formType === 'login' ? 'current-password' : 'new-password'
//               }
//             />
//           </>
//         )
//       case 'forgotPassword':
//         return (
//           <TextInput
//             label='Email'
//             name='email'
//             type='email'
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             placeholder='you@example.com'
//             required
//             autoComplete='email'
//           />
//         )
//       case 'changePassword':
//         return (
//           <>
//             <TextInput
//               label='Current Password'
//               name='currentPassword'
//               type='password'
//               value={currentPassword}
//               onChange={(e) => setCurrentPassword(e.target.value)}
//               placeholder='Current password'
//               required
//               autoComplete='current-password'
//             />
//             <TextInput
//               label='New Password'
//               name='newPassword'
//               type='password'
//               value={newPassword}
//               onChange={(e) => setNewPassword(e.target.value)}
//               placeholder='New password'
//               required
//               autoComplete='new-password'
//             />
//             <TextInput
//               label='Confirm New Password'
//               name='confirmNewPassword'
//               type='password'
//               value={confirmNewPassword}
//               onChange={(e) => setConfirmNewPassword(e.target.value)}
//               placeholder='Confirm new password'
//               required
//               autoComplete='new-password'
//             />
//           </>
//         )
//     }
//   }

//   return (
//     <div className={`auth-container ${formType}-container`}>
//       <div className={`auth-card ${formType}-card`}>
//         <h2>{getTitle()}</h2>
//         {formType === 'forgotPassword' && (
//           <p className='forgot-subtext'>
//             Enter your registered email and we’ll send you a reset link.
//           </p>
//         )}
//         {formType === 'changePassword' && (
//           <p className='forgot-subtext'>
//             Enter your current password and a new password to update your
//             account.
//           </p>
//         )}
//         <form onSubmit={handleSubmit}>
//           {renderInputs()}
//           <button type='submit' disabled={loading}>
//             {getButtonText()}
//           </button>
//           {message && <p className='success-message'>{message}</p>}
//           {error && <p className='error-message'>{error}</p>}
//           {formType === 'login' && (
//             <p className='forgot-password-link'>
//               Forgot your password? <Link to='/forgot-password'>Reset it</Link>
//             </p>
//           )}
//         </form>
//       </div>
//     </div>
//   )
// }
// export default AuthForm

'use client'
import React, { useReducer } from 'react'
import { Link } from 'react-router-dom'
import TextInput from '../ProfileForm/inputs/TextInput'

interface AuthFormProps {
  formType: AuthFormType
  onSubmit: (data: Record<string, string>) => Promise<void>
  loading?: boolean
  error?: string | null
  message?: string | null
}

type AuthFormType = 'login' | 'signup' | 'forgotPassword' | 'changePassword'

type FieldConfig = {
  label: string
  name: string
  type: string
  placeholder?: string
  required?: boolean
  autoComplete?: string
}

const formConfig: Record<
  AuthFormType,
  { title: string; button: string; fields: FieldConfig[]; subtext?: string }
> = {
  login: {
    title: 'Log In',
    button: 'Log In',
    fields: [
      {
        label: 'Email',
        name: 'email',
        type: 'email',
        required: true,
        autoComplete: 'email',
      },
      {
        label: 'Password',
        name: 'password',
        type: 'password',
        required: true,
        autoComplete: 'current-password',
      },
    ],
  },
  signup: {
    title: 'Sign Up',
    button: 'Sign Up',
    fields: [
      {
        label: 'Email',
        name: 'email',
        type: 'email',
        required: true,
        autoComplete: 'email',
      },
      {
        label: 'Password',
        name: 'password',
        type: 'password',
        required: true,
        autoComplete: 'new-password',
      },
    ],
  },
  forgotPassword: {
    title: 'Reset Your Password',
    button: 'Send Reset Email',
    subtext: 'Enter your registered email and we’ll send you a reset link.',
    fields: [
      {
        label: 'Email',
        name: 'email',
        type: 'email',
        required: true,
        autoComplete: 'email',
      },
    ],
  },
  changePassword: {
    title: 'Change Password',
    button: 'Update Password',
    subtext:
      'Enter your current password and a new password to update your account.',
    fields: [
      {
        label: 'Current Password',
        name: 'currentPassword',
        type: 'password',
        required: true,
        autoComplete: 'current-password',
      },
      {
        label: 'New Password',
        name: 'newPassword',
        type: 'password',
        required: true,
        autoComplete: 'new-password',
      },
      {
        label: 'Confirm New Password',
        name: 'confirmNewPassword',
        type: 'password',
        required: true,
        autoComplete: 'new-password',
      },
    ],
  },
}

// Reducer for form state
type FormState = Record<string, string>
type Action = { type: 'SET_FIELD'; field: string; value: string }

const reducer = (state: FormState, action: Action): FormState => {
  if (action.type === 'SET_FIELD') {
    return { ...state, [action.field]: action.value }
  }
  return state
}

const AuthForm: React.FC<AuthFormProps> = ({
  formType,
  onSubmit,
  loading,
  error,
  message,
}) => {
  const { title, button, fields, subtext } = formConfig[formType]

  const [state, dispatch] = useReducer(reducer, {})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit(state)
  }

  return (
    <div className={`auth-container ${formType}-container`}>
      <div className={`auth-card ${formType}-card`}>
        <h2>{title}</h2>
        {subtext && <p className='form-subtext'>{subtext}</p>}

        <form onSubmit={handleSubmit}>
          {fields.map(
            ({ label, name, type, placeholder, required, autoComplete }) => (
              <TextInput
                key={name}
                label={label}
                name={name}
                type={type}
                value={state[name] || ''}
                onChange={(e) =>
                  dispatch({
                    type: 'SET_FIELD',
                    field: name,
                    value: e.target.value,
                  })
                }
                placeholder={placeholder || label}
                required={required}
                autoComplete={autoComplete}
              />
            )
          )}

          <button type='submit' disabled={loading}>
            {loading ? 'Processing...' : button}
          </button>

          {message && <p className='success-message'>{message}</p>}
          {error && <p className='error-message'>{error}</p>}

          {formType === 'login' && (
            <p className='forgot-password-link'>
              Forgot your password? <Link to='/forgot-password'>Reset it</Link>
            </p>
          )}
        </form>
      </div>
    </div>
  )
}

export default AuthForm
