import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthProvider'
import Layout from './components/Layout/Layout'
import './App.css'
// import './styles/Button.css'
import { Suspense, lazy } from 'react'

// 💡 Lazy-load your route components
const LandingPage = lazy(() => import('./pages/LandingPage/LandingPage'))
const ProtectedChat = lazy(() => import('./components/Protected/ProtectedChat'))
const TermsOfService = lazy(
  () => import('./pages/TermsOfService/TermsOfService')
)
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy/PrivacyPolicy'))

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
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
              <Route path='/chat' element={<ProtectedChat />} />
              <Route path='/privacy-policy' element={<PrivacyPolicy />} />
              <Route path='/terms-of-service' element={<TermsOfService />} />
            </Route>
            <Route path='*' element={<Navigate to='/' replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App

// import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
// import { AuthProvider } from './contexts/AuthProvider'
// import Layout from './components/Layout/Layout'
// import LandingPage from './pages/LandingPage/LandingPage'
// import './App.css'
// import './styles/Button.css'
// import TermsOfService from './pages/TermsOfService/TermsOfService'
// import PrivacyPolicy from './pages/PrivacyPolicy/PrivacyPolicy'

// import ProtectedChat from './components/Protected/ProtectedChat'

// function App() {
//   return (
//     <AuthProvider>
//       <BrowserRouter>
//         <Routes>
//           <Route element={<Layout />}>
//             <Route path='/' element={<LandingPage />} />
//             <Route path='/chat' element={<ProtectedChat />} />
//             <Route path='/privacy-policy' element={<PrivacyPolicy />} />
//             <Route path='/terms-of-service' element={<TermsOfService />} />
//           </Route>
//           <Route path='*' element={<Navigate to='/' replace />} />
//         </Routes>
//       </BrowserRouter>
//     </AuthProvider>
//   )
// }

// export default App
