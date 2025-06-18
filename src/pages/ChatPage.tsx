import { GoogleLogin } from '@react-oauth/google'
import AIChat from '../components/AIChat'
import { useAuth } from '../contexts/useAuth'

export default function ChatPage() {
  const { user, login, logout } = useAuth()

  return (
    <main className='chat-page'>
      {!user ? (
        <GoogleLogin
          onSuccess={login}
          onError={() => console.log('Login Failed')}
          theme='filled_black'
          size='large'
          useOneTap // Optional: enables Google One Tap
        />
      ) : (
        <div className='app-content'>
          <AIChat googleUser={user} />
          <button onClick={logout} className='logout-button'>
            Sign Out
          </button>
        </div>
      )}
    </main>
  )
}
