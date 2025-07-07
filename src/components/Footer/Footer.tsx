import { Link } from 'react-router-dom'
import './Footer.css'
function Footer() {
  const currentYear = new Date().getFullYear()
  return (
    <footer className='app-footer'>
      <p>&copy; {currentYear} AI Trainer. All rights reserved.</p>
      <nav className='footer-nav'>
        <Link to='/privacy-policy'>Privacy Policy</Link>
        <span className='footer-separator'>|</span>
        <Link to='/terms-of-service'>Terms of Service</Link>
        <span className='footer-separator'>|</span>
        <Link to='/'>Home</Link>
      </nav>
    </footer>
  )
}

export default Footer
