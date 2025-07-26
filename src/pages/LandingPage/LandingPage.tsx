// src/pages/LandingPage/LandingPage.tsx
import { useNavigate } from 'react-router-dom'
import '../LandingPage/LandingPage.css'
import { landingPageContent } from './LandingPageContent'
import FeatureCard from '../../components/FeatureCard/FeatureCard' // Fixed extra space in import

export default function LandingPage() {
  const navigate = useNavigate()
  const {
    mainTitle,
    subtitle,
    heroImage,
    features,
    ctaButtonText,
    ctaButtonPath,
  } = landingPageContent

  const handleCTAClick = () => {
    navigate(ctaButtonPath)
  }

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
                loading='lazy' // Added for better performance
              />
            </picture>
          </div>
        </header>

        <section className='features-container' aria-label='Key features'>
          <div className='features-grid'>
            {features.map((feature, index) => (
              <FeatureCard
                key={`feature-${index}`} // Better key convention
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </div>
        </section>

        <button
          className='cta-button pulse-animation'
          onClick={handleCTAClick}
          aria-label='Get started with AI Fitness Trainer'
        >
          {ctaButtonText}
        </button>
      </div>
    </div>
  )
}
