import { useNavigate } from 'react-router-dom'
import '../LandingPage/LandingPage.css'

function LandingPage() {
  const navigate = useNavigate()
  return (
    <div className='landing-container'>
      <div className='landing-content'>
        <h1>AI Fitness Trainer</h1>
        <p>Your personalized AI-powered workout coach</p>

        <img
          src={'/andyanime.png'}
          alt={'AI Trainer Image'}
          className='hero-image'
        />

        <div className='features'>
          <div className='feature'>
            <h3>Custom Workouts</h3>
            <p>Tailored to your fitness level and goals</p>
          </div>
          <div className='feature'>
            <h3>Real-Time Feedback</h3>
            <p>AI form correction for perfect technique</p>
          </div>
          <div className='feature'>
            <h3>Progress Tracking</h3>
            <p>Monitor your improvements over time</p>
          </div>
        </div>
        <button onClick={() => navigate('/chat')} className='cta-button'>
          Get Started
        </button>
      </div>
    </div>
  )
}

export default LandingPage
