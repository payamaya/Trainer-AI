import { GoogleLogin } from '@react-oauth/google'
import { useAuth } from '../../contexts/useAuth'
import AIChat from '../Chat/AIChat'

export default function ProtectedChat() {
  const { user, firebaseUser, login } = useAuth()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleGoogleSuccess = async (credentialResponse: any) => {
    if (credentialResponse.credential) {
      try {
        await login(credentialResponse)
      } catch (error) {
        console.error('Authentication failed:', error)
      }
    }
  }
  if (!user || !firebaseUser) {
    return (
      <div className='auth-container'>
        <div className='login-box'>
          <h2 className='auth-title'>Welcome to AI Trainer</h2>
          <p className='auth-subtitle'>
            Please sign in with Google to continue
          </p>
          <img
            src={'/andyanime.png'}
            alt={'AI Trainer Image'}
            className='hero-image-google'
          />
          <div className='google-button-container'>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => {
                console.log('Login Failed')
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

  return (
    <main className='chat-main-container'>
      <div className='app-content'>
        <AIChat googleUser={user} />
      </div>
    </main>
  )
}
