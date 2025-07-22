import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthProvider'
import Layout from './components/Layout/Layout'
import LandingPage from './pages/LandingPage/LandingPage'
import './App.css'
import './styles/Button.css'
import TermsOfService from './pages/TermsOfService/TermsOfService'
import PrivacyPolicy from './pages/PrivacyPolicy/PrivacyPolicy'

import ProtectedChat from './components/Protected/ProtectedChat'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path='/' element={<LandingPage />} />
            <Route path='/chat' element={<ProtectedChat />} />
            <Route path='/privacy-policy' element={<PrivacyPolicy />} />
            <Route path='/terms-of-service' element={<TermsOfService />} />
          </Route>
          <Route path='*' element={<Navigate to='/' replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
