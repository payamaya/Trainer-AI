import { Link } from 'react-router-dom'
import './Footer.css'
import { NAV_LINKS } from '../../config/navLink'
import React from 'react'
function Footer() {
  const currentYear = new Date().getFullYear()

  const footerLinks = NAV_LINKS.filter((link) =>
    ['/privacy-policy', '/terms-of-service', '/chat', '/'].includes(link.path)
  )
  return (
    <footer className='app-footer'>
      <p>&copy; {currentYear} AI Trainer. All rights reserved.</p>
      <nav className='footer-nav'>
        {footerLinks.map((link, index) => (
          <React.Fragment key={link.path}>
            <Link to={link.path}>{link.label}</Link>
            {index < footerLinks.length - 1 && (
              <span className='footer-separator'>|</span>
            )}
          </React.Fragment>
        ))}
      </nav>
    </footer>
  )
}

export default Footer
