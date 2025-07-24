'use client'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { FaBars, FaTimes } from 'react-icons/fa'
import './Navbar.css'
import type { NavbarProps } from './NavbarProps'
import { renderMenuItems } from './NavbarHelper'

const Navbar: React.FC<NavbarProps> = ({ user, logout }) => {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => setIsOpen(!isOpen)
  const closeMenu = () => setIsOpen(false)

  return (
    <nav className='navbar'>
      <div className='navbar-container'>
        <Link to='/' className='navbar-logo' onClick={closeMenu}>
          <img
            src='/andyanime.webp'
            alt='AI Trainer Logo'
            className='logo-img'
          />
        </Link>

        <div className='menu-icon' onClick={toggleMenu}>
          {isOpen ? <FaTimes /> : <FaBars />}
        </div>

        <ul className='nav-menu desktop-menu'>
          {renderMenuItems(user, logout, closeMenu)}
        </ul>

        <ul
          className={
            isOpen ? 'nav-menu mobile-menu active' : 'nav-menu mobile-menu'
          }
        >
          {renderMenuItems(user, logout, closeMenu, true)}
        </ul>
      </div>
    </nav>
  )
}

export default Navbar
