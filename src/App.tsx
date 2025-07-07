import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { useAuth } from './contexts/useAuth'
import { GoogleLogin } from '@react-oauth/google'
import Layout from './components/Layout'
import LandingPage from './pages/LandingPage/LandingPage'
import AIChat from './components/Chat/AIChat'
import './App.css'
import './styles/Button.css'
import FunctionsPage from './pages/FunctionPage'
import TermsOfService from './pages/TermsOfService/TermsOfService'
import PrivacyPolicy from './pages/PrivacyPolicy/PrivacyPolicy'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path='/' element={<LandingPage />} />
            <Route path='/chat' element={<ProtectedChat />} />
            <Route path='/chat' element={<ProtectedChat />} />

            <Route path='/functions' element={<FunctionsPage />} />
            <Route path='/privacy-policy' element={<PrivacyPolicy />} />
            <Route path='/terms-of-service' element={<TermsOfService />} />
          </Route>
          <Route path='*' element={<Navigate to='/' replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

function ProtectedChat() {
  const { user, login } = useAuth()

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
        {/* <button onClick={logout} className='logout-button'>
          Sign Out
        </button> */}
      </div>
    </main>
  )
}

export default App
