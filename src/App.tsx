import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthProvider'
import Layout from './components/Layout/Layout'
import './App.css'
import { Suspense, lazy } from 'react'
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary'
import ErrorScreen from './components/ErrorScreen/ErrorScreen'
import ProtectedRoute from './components/Auth/ProtectedRoute'

const LandingPage = lazy(() => import('./pages/LandingPage/LandingPage'))
const ProtectedChat = lazy(() => import('./components/Protected/ProtectedChat'))
const TermsOfService = lazy(
  () => import('./pages/TermsOfService/TermsOfService')
)
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy/PrivacyPolicy'))
// Import the new EmailVerificationHandler component
const EmailVerificationHandler = lazy(
  () => import('./components/Auth/EmailVerificationHandler')
)
const ForgotPassword = lazy(() => import('./components/Auth/ForgotPassword'))
const ChangePasswordForm = lazy(
  () => import('./components/Auth/ChangePasswordForm')
)
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ErrorBoundary fallback={<ErrorScreen />}>
          <Suspense
            fallback={
              <div className='loader-container'>
                <div className='loader'></div>
              </div>
            }
          >
            <Routes>
              <Route element={<Layout />}>
                <Route path='/' element={<LandingPage />} />
                <Route path='/privacy-policy' element={<PrivacyPolicy />} />
                <Route path='/terms-of-service' element={<TermsOfService />} />
                <Route path='/forgot-password' element={<ForgotPassword />} />

                {/* Protected Routes */}
                <Route path='/chat' element={<ProtectedChat />} />
                <Route element={<ProtectedRoute />}>
                  <Route
                    path='/change-password'
                    element={<ChangePasswordForm />}
                  />
                </Route>
              </Route>
              {/* Add the new route to handle email verification */}
              <Route path='/auth' element={<EmailVerificationHandler />} />
              <Route path='*' element={<Navigate to='/' replace />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
