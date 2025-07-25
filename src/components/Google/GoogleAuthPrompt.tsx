import React from 'react'
import { GoogleLogin, type CredentialResponse } from '@react-oauth/google'
import './GoogleLogin.css'

interface GoogleAuthPromptProps {
  onGoogleSuccess: (credentialResponse: CredentialResponse) => Promise<void>
}

const GoogleAuthPrompt: React.FC<GoogleAuthPromptProps> = ({
  onGoogleSuccess,
}) => {
  return (
    <div className='auth-container'>
      <div className='login-box'>
        <h2 className='auth-title'>Welcome to AI Trainer</h2>
        <p className='auth-subtitle'>Please sign in with Google to continue</p>
        <picture>
          <img
            src={'/andyanime.png'}
            alt={'AI Trainer Image'}
            className='hero-image-google'
          />
        </picture>
        <div className='google-button-container'>
          <GoogleLogin
            onSuccess={onGoogleSuccess}
            onError={() => {
              console.log('Google Login Failed')
              // You might want to show a user-friendly error message here
            }}
            theme='filled_blue'
            size='large'
            width='250'
          />
        </div>
      </div>
    </div>
  )
}

export default GoogleAuthPrompt
