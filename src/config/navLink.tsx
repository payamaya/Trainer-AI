import {
  FaHome as HomeIcon,
  FaComment as ChatIcon,
  FaShieldAlt as PrivacyIcon,
  FaFileContract as TermsIcon,
} from 'react-icons/fa'
import React from 'react'

interface NavLink {
  path: string
  label: string
  requiresAuth?: boolean
  icon?: React.ReactNode
  submenu?: NavLink[]
  className?: string
}

export const NAV_LINKS: NavLink[] = [
  {
    path: '/',
    label: 'Home',
    icon: <HomeIcon className='nav-icon' />,
  },
  {
    path: '/chat',
    label: 'Chat',
    requiresAuth: true,
    icon: <ChatIcon className='nav-icon' />,
  },
  {
    path: '/privacy-policy',
    label: 'Privacy Policy',
    icon: <PrivacyIcon className='nav-icon' />,
  },
  {
    path: '/terms-of-service',
    label: 'Terms of Service',
    icon: <TermsIcon className='nav-icon' />,
  },
]
