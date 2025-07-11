import { useNavigate } from 'react-router-dom'
import '../LandingPage/LandingPage.css'

function LandingPage() {
  const navigate = useNavigate()
  return (
    <div className='landing-container'>
      <div className='landing-content'>
        <header className='landing-header'>
          <div className='header-content'>
            <h1 className='main-title'>AI Fitness Trainer</h1>
            <p className='subtitle'>
              Your personalized AI-powered workout coach
            </p>
            <div className='hero-image-container'>
              <img
                src='/andyanime.png'
                alt='AI Trainer'
                className='hero-image'
              />
            </div>
          </div>
        </header>

        <div className='features-container'>
          <div className='features-grid'>
            <div className='feature-card'>
              <div className='feature-icon'>💪</div>
              <h3 className='feature-title'>Custom Workouts</h3>
              <p className='feature-description'>
                Tailored to your fitness level and goals
              </p>
            </div>

            <div className='feature-card'>
              <div className='feature-icon'>👁️</div>
              <h3 className='feature-title'>Real-Time Feedback</h3>
              <p className='feature-description'>
                AI form correction for perfect technique
              </p>
            </div>

            <div className='feature-card'>
              <div className='feature-icon'>📈</div>
              <h3 className='feature-title'>Progress Tracking</h3>
              <p className='feature-description'>
                Monitor your improvements over time
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => navigate('/chat')}
          className='cta-button pulse-animation'
        >
          Get Started
        </button>
      </div>
    </div>
  )
}

export default LandingPage
