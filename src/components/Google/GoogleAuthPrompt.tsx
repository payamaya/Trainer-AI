import React, { useState } from 'react'
import { GoogleLogin, type CredentialResponse } from '@react-oauth/google'
import './LoginScreen.css'
import EmailPasswordSignup from '../Auth/EmailPasswordSignup'
import EmailPasswordLogin from '../Auth/EmailPasswordLogin'
import GithubLogin from './GithubLogin'

interface GoogleAuthPromptProps {
  onGoogleSuccess: (credentialResponse: CredentialResponse) => Promise<void>
}

const GoogleAuthPrompt: React.FC<GoogleAuthPromptProps> = ({
  onGoogleSuccess,
}) => {
  const [isSigningUp, setIsSigningUp] = useState(false)

  return (
    <div className='auth-container'>
      <div className='login-box'>
        <h2 className='auth-title'>Welcome to AI Trainer</h2>
        <p className='auth-subtitle'>
          Please sign in with your preferred method
        </p>
        <picture>
          <img
            src={'/andyanime.png'}
            alt={'AI Trainer Image'}
            className='hero-image-google'
          />
        </picture>
        <div className='social-login-container'>
          {/* <div className='google-button-container'> */}
          <GoogleLogin
            onSuccess={onGoogleSuccess}
            onError={() => {
              console.log('Google Login Failed')
            }}
            theme='filled_blue'
            size='large'
            width='250'
          />
          {/* </div> */}
          <GithubLogin />
        </div>

        <div className='divider'>
          <hr />
          <span>OR</span>
          <hr />
        </div>

        <div className='email-form-container'>
          {isSigningUp ? <EmailPasswordSignup /> : <EmailPasswordLogin />}
          <p className='toggle-auth-mode'>
            {isSigningUp
              ? 'Already have an account?'
              : "Don't have an account?"}
            <button onClick={() => setIsSigningUp(!isSigningUp)}>
              {isSigningUp ? 'Log in' : 'Sign up'}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default GoogleAuthPrompt
