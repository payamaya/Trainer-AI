import { useNavigate } from 'react-router-dom'
import '../LandingPage/LandingPage.css'
import { landingPageContent } from './LandingPageContent'
import FeatureCard from './FeatureCard '

function LandingPage() {
  const navigate = useNavigate()
  const {
    mainTitle,
    subtitle,
    heroImage,
    features,
    ctaButtonText,
    ctaButtonPath,
  } = landingPageContent

  return (
    <div className='landing-container'>
      <div className='landing-content'>
        <header className='landing-header'>
          <div className='header-content'>
            <h1 className='main-title'>{mainTitle}</h1>
            <p className='subtitle'>{subtitle}</p>
            <picture className='hero-image-container'>
              <source srcSet={heroImage.webp} type='image/webp' />
              <img
                src={heroImage.fallback}
                alt={heroImage.alt}
                className='hero-image'
                width={heroImage.width}
                height={heroImage.height}
              />
            </picture>
          </div>
        </header>

        <div className='features-container'>
          <div className='features-grid'>
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </div>
        </div>
        <button
          className='cta-button pulse-animation'
          onClick={() => navigate(ctaButtonPath)}
        >
          {ctaButtonText}
        </button>
      </div>
    </div>
  )
}

export default LandingPage
