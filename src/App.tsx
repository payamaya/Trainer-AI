import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { useAuth } from './contexts/useAuth'
import { GoogleLogin } from '@react-oauth/google'
import Layout from './components/Layout'
import LandingPage from './pages/LandingPage/LandingPage'
import AIChat from './components/AIChat'
import './App.css'
import './styles/Button.css'
import FunctionsPage from './pages/FunctionPage'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route
              path='https://trainer-ai-six.vercel.app/'
              element={<LandingPage />}
            />
            <Route
              path='https://trainer-ai-six.vercel.app/chat'
              element={<ProtectedChat />}
            />
            <Route
              path='https://trainer-ai-six.vercel.app/functions'
              element={<FunctionsPage />}
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

function ProtectedChat() {
  const { user, login, logout } = useAuth()

  if (!user) {
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
              onSuccess={login}
              onError={() => console.log('Login Failed')}
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
        <button onClick={logout} className='logout-button'>
          Sign Out
        </button>
      </div>
    </main>
  )
}

export default App
