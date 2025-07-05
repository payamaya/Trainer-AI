import React from 'react'
import './LegalPages.css' // Optional styling

const TermsOfService: React.FC = () => {
  return (
    <div className='legal-page'>
      <h1>Terms of Service</h1>
      <p>Last updated: {new Date('2025-07-05').toLocaleDateString()}</p>

      <section>
        <h2>1. Acceptance of Terms</h2>
        <p>By using AI Trainer, you agree to these terms.</p>
      </section>

      <section>
        <h2>2. Service Description</h2>
        <p className='para'>
          AI Trainer provides personalized workout recommendations through AI
          analysis.
        </p>
      </section>

      <section>
        <h2>3. User Responsibilities</h2>
        <p>You agree to:</p>
        <ul>
          <li>Use the service for personal, non-commercial purposes</li>
          <li>Not misuse the AI recommendations</li>
          <li>Consult a physician before beginning any exercise program</li>
        </ul>
      </section>

      <section>
        <h2>4. Limitation of Liability</h2>
        <p className='para'>
          We are not responsible for any injuries resulting from use of this
          app.
        </p>
      </section>

      <section>
        <h2>5. Changes to Terms</h2>
        <p>We may update these terms periodically.</p>
      </section>
    </div>
  )
}

export default TermsOfService
