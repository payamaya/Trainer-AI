import React from 'react'
import '../TermsOfService/LegalPages.css' // Reuse the same styling

const PrivacyPolicy: React.FC = () => {
  return (
    <div className='legal-page'>
      <h1>Privacy Policy</h1>
      <p>Last updated: {new Date('2025-07-05').toLocaleDateString()}</p>

      <section>
        <h2>1. Information We Collect</h2>
        <p>When you sign in with Google, we collect:</p>
        <ul>
          <li>Your name</li>
          <li>Email address</li>
          <li>Profile picture URL (provided by Google)</li>
        </ul>
      </section>

      <section>
        <h2>2. How We Use Your Information</h2>
        <p>We use this information to:</p>
        <ul>
          <li>Authenticate your account</li>
          <li>Personalize your experience</li>
          <li>Provide workout recommendations</li>
        </ul>
      </section>

      <section>
        <h2>3. Data Security</h2>
        <p>We implement security measures to protect your information.</p>
      </section>

      <section>
        <h2>4. Contact Us</h2>
        <p>
          For questions about this policy, contact:{' '}
          <a href='mailto:paulyashou81@gmail.com'>paulyashou81@gmail.com</a>
        </p>
      </section>

      <footer className='legal-footer'>
        <p>
          © {new Date().getFullYear()} AI Trainer. All rights reserved.
          <br />
          Website:{' '}
          <a
            href='https://trainer-ai-six.vercel.app'
            target='_blank'
            rel='noopener noreferrer'
          >
            https://trainer-ai-six.vercel.app
          </a>
        </p>
      </footer>
    </div>
  )
}

export default PrivacyPolicy
