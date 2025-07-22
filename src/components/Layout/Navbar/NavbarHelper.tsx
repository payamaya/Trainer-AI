import { NavLink } from 'react-router-dom'
import type { NavbarProps } from './NavbarProps'
import { NAV_LINKS } from '../../../config/navLink'
import './Navbar.css'
import { SignInIcon, SignOutIcon } from '../../Icons'

export const renderMenuItems = (
  user: NavbarProps['user'],
  logout: NavbarProps['logout'],
  closeMenu: () => void,
  isMobile = false,
  isLoading = false
) => {
  const handleLogout = () => {
    logout()
    closeMenu()
  }

  return (
    <>
      {NAV_LINKS.map((link) => {
        if (link.requiresAuth && !user) return null

        return (
          <li key={link.path} className='nav-item'>
            <NavLink
              to={link.path}
              className={({ isActive }) =>
                `nav-links${isActive ? ' active' : ''}`
              }
              onClick={isMobile ? closeMenu : undefined}
            >
              {link.icon}
              <span className='nav-link-text'>{link.label}</span>
            </NavLink>
          </li>
        )
      })}

      <li className='nav-item'>
        {user ? (
          <button
            onClick={handleLogout}
            className='nav-links auth-button'
            disabled={isLoading}
            aria-label={isLoading ? 'Signing out...' : 'Sign out'}
          >
            <SignOutIcon className='nav-icon' />
            <span className='nav-link-text'>
              {isLoading ? 'Signing out...' : 'Sign Out'}
            </span>
          </button>
        ) : (
          <NavLink
            to='/chat'
            className='nav-links auth-button'
            onClick={isMobile ? closeMenu : undefined}
          >
            <SignInIcon className='nav-icon' />
            <span className='nav-link-text'>Login</span>
          </NavLink>
        )}
      </li>
    </>
  )
}
