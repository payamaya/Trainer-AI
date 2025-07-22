import { Outlet } from 'react-router-dom'
import { useAuth } from '../../contexts/useAuth'
import Navbar from './Navbar/Navbar'
import DarkMode from '../DarkModeButton/DarkMode'
import Footer from '../Footer/Footer'
import './Layout.css'

export default function Layout() {
  // CORRECTED: Call useAuth INSIDE the functional component
  const { user, logout } = useAuth()

  return (
    <div className='app-container'>
      {/* Pass user and logout to the Navbar */}
      <Navbar user={user} logout={logout} />
      <DarkMode />
      <main className='main-content'>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
