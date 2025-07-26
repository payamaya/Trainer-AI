// src/components/ErrorScreen/ErrorScreen.tsx
import { useNavigate } from 'react-router-dom'
import './ErrorScreen.css'

const ErrorScreen = () => {
  const navigate = useNavigate()

  return (
    <div className='error-screen'>
      <div className='error-content'>
        <h1>Something went wrong</h1>
        <p>We're sorry, but an unexpected error occurred.</p>
        <button
          className='error-retry-button'
          onClick={() => window.location.reload()}
        >
          Reload Page
        </button>
        <button className='error-home-button' onClick={() => navigate('/')}>
          Go to Home
        </button>
      </div>
    </div>
  )
}

export default ErrorScreen
