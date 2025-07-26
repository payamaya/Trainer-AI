import type { FeatureCardProps } from '../../components/FeatureCard/FeatureCardProps'
interface HeroImage {
  webp: string
  fallback: string
  alt: string
  width: number
  height: number
}
export interface LandingPageContentProps {
  mainTitle: string
  subtitle: string
  heroImage: HeroImage
  features: FeatureCardProps[]
  ctaButtonText: string
  ctaButtonPath: string
}
