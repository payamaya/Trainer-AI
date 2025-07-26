import type { LandingPageContentProps } from './LandingPageContentProps'

export const landingPageContent: LandingPageContentProps = {
  mainTitle: 'AI Fitness Trainer',
  subtitle: 'Your personalized AI-powered workout coach',
  heroImage: {
    webp: '/andyanime.webp',
    fallback: '/andyanime.webp',
    alt: 'AI Trainer',
    width: 630,
    height: 630,
  },
  features: [
    {
      icon: '💪', // Emoji for simplicity. Could be a component like <FaDumbbell />
      title: 'Custom Workouts',
      description: 'Tailored to your fitness level and goals',
    },
    {
      icon: '👁️',
      title: 'Real-Time Feedback',
      description: 'AI form correction for perfect technique',
    },
    {
      icon: '📈',
      title: 'Progress Tracking',
      description: 'Monitor your improvements over time',
    },
    // Add more features easily here without touching JSX
    // {
    //   icon: '🍎',
    //   title: 'Nutrition Guidance',
    //   description: 'Personalized meal plans and dietary advice',
    // },
  ],
  ctaButtonText: 'Get Started',
  ctaButtonPath: '/chat',
}
