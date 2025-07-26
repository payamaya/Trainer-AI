import React from 'react'
import './FeatureCard.css' // Create a new CSS file for this component's styles
import type { FeatureCardProps } from './FeatureCardProps'

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
}) => {
  return (
    <div className='feature-card'>
      <div className='feature-icon'>{icon}</div>
      <h2 className='feature-title'>{title}</h2>
      <p className='feature-description'>{description}</p>
    </div>
  )
}

export default FeatureCard
