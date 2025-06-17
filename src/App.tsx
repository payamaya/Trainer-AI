import { GoogleLogin } from '@react-oauth/google'
import AIChat from './components/AIChat'
import { useEffect, useState } from 'react'
import './App.css'
import './styles/Button.css'

interface GoogleUser {
  name: string
  email: string
  picture?: string
}

function App() {
  const [user, setUser] = useState<GoogleUser | null>(null)
  useEffect(() => {
    if (user) {
      localStorage.setItem('googleUser', JSON.stringify(user))
    }
  }, [user])

  useEffect(() => {
    const savedUser = localStorage.getItem('googleUser')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
  }, [])
  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('googleUser')
  }
  return (
    <main className='w-full flex justify-center items-center'>
      {!user ? (
        <GoogleLogin
          onSuccess={(credentialResponse) => {
            if (credentialResponse.credential) {
              // Decode JWT to get user info
              const base64Url = credentialResponse.credential.split('.')[1]
              const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
              const jsonPayload = decodeURIComponent(
                atob(base64)
                  .split('')
                  .map(
                    (c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
                  )
                  .join('')
              )

              const userData = JSON.parse(jsonPayload)
              setUser({
                name: userData.name,
                email: userData.email,
                picture: userData.picture,
              })
            }
          }}
          onError={() => console.log('Login Failed')}
          theme='filled_black'
          size='large'
        />
      ) : (
        <div className='app-content'>
          <AIChat googleUser={user} />
          <button
            onClick={handleLogout}
            className='logout-button'
            aria-label='Logout'
          >
            <span className='logout-icon'>
              <svg viewBox='0 0 24 24' width='18' height='18'>
                <path
                  fill='currentColor'
                  d='M16 17v-3H9v-4h7V7l5 5-5 5M14 2a2 2 0 012 2v2h-2V4H5v16h9v-2h2v2a2 2 0 01-2 2H5a2 2 0 01-2-2V4a2 2 0 012-2h9z'
                />
              </svg>
            </span>
            Sign Out
          </button>
        </div>
      )}
    </main>
  )
}

export default App
