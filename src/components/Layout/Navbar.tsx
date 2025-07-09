'use client'
import React, { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { FaBars, FaTimes } from 'react-icons/fa' // Importing icons for hamburger/close
import './Navbar.css' // We'll create this CSS file next
import type { GoogleUser } from '../../types'

interface NavbarProps {
  user: GoogleUser | null
  logout: () => void
}
const Navbar: React.FC<NavbarProps> = ({ user, logout }) => {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const closeMenu = () => {
    setIsOpen(false)
  }
  const handleSignOut = () => {
    logout()
    closeMenu()
  }
  return (
    <nav className='navbar'>
      <div className='navbar-container'>
        <Link to='/' className='navbar-logo' onClick={closeMenu}>
          <img
            src='/andyanime.png'
            alt='AI Trainer Logo'
            className='logo-img'
          />
        </Link>

        {/* Hamburger menu icon for mobile */}
        <div className='menu-icon' onClick={toggleMenu}>
          {isOpen ? <FaTimes /> : <FaBars />}
        </div>

        {/* Desktop Navigation Menu */}
        <ul className='nav-menu desktop-menu'>
          <li className='nav-item'>
            <NavLink
              to='/'
              className={({ isActive }) =>
                'nav-links' + (isActive ? ' active' : '')
              }
            >
              Home
            </NavLink>
          </li>
          {user && (
            <li className='nav-item'>
              <NavLink
                to='/chat'
                className={({ isActive }) =>
                  'nav-links' + (isActive ? ' active' : '')
                }
              >
                Chat
              </NavLink>
            </li>
          )}
          <li className='nav-item'>
            <NavLink
              to='/functions'
              className={({ isActive }) =>
                'nav-links' + (isActive ? ' active' : '')
              }
            >
              Functions
            </NavLink>
          </li>
          <li className='nav-item'>
            <NavLink
              to='/privacy-policy'
              className={({ isActive }) =>
                'nav-links' + (isActive ? ' active' : '')
              }
            >
              Privacy Policy
            </NavLink>
          </li>
          <li className='nav-item'>
            <NavLink
              to='/terms-of-service'
              className={({ isActive }) =>
                'nav-links' + (isActive ? ' active' : '')
              }
            >
              Terms of Service
            </NavLink>
          </li>
          {user ? (
            <li className='nav-item'>
              <button
                onClick={handleSignOut}
                className='nav-links logout-button-desktop'
              >
                Sign Out
              </button>
            </li>
          ) : (
            <li className='nav-item'>
              <NavLink to='/chat' className='nav-links' onClick={closeMenu}>
                Login
              </NavLink>
            </li>
          )}
        </ul>

        {/* Mobile Navigation Menu (appears conditionally) */}
        <ul
          className={
            isOpen ? 'nav-menu mobile-menu active' : 'nav-menu mobile-menu'
          }
        >
          <li className='nav-item'>
            <NavLink
              to='/'
              className={({ isActive }) =>
                'nav-links' + (isActive ? ' active' : '')
              }
              onClick={closeMenu}
            >
              Home
            </NavLink>
          </li>
          <li className='nav-item'>
            <NavLink
              to='/chat'
              className={({ isActive }) =>
                'nav-links' + (isActive ? ' active' : '')
              }
              onClick={closeMenu}
            >
              Chat
            </NavLink>
          </li>
          <li className='nav-item'>
            <NavLink
              to='/functions'
              className={({ isActive }) =>
                'nav-links' + (isActive ? ' active' : '')
              }
              onClick={closeMenu}
            >
              Functions
            </NavLink>
          </li>
          <li className='nav-item'>
            <NavLink
              to='/privacy-policy'
              className={({ isActive }) =>
                'nav-links' + (isActive ? ' active' : '')
              }
              onClick={closeMenu}
            >
              Privacy Policy
            </NavLink>
          </li>
          <li className='nav-item'>
            <NavLink
              to='/terms-of-service'
              className={({ isActive }) =>
                'nav-links' + (isActive ? ' active' : '')
              }
              onClick={closeMenu}
            >
              Terms of Service
            </NavLink>
          </li>
          {user ? (
            <li className='nav-item'>
              <button
                onClick={handleSignOut}
                className='nav-links logout-button-desktop'
              >
                Sign Out
              </button>
            </li>
          ) : (
            <li className='nav-item'>
              <NavLink to='/chat' className='nav-links' onClick={closeMenu}>
                Login
              </NavLink>
            </li>
          )}
        </ul>
      </div>
    </nav>
  )
}

export default Navbar
