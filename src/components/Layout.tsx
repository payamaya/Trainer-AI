import { Outlet } from 'react-router-dom'
import { useAuth } from '../contexts/useAuth'
import Navbar from './Layout/Navbar'
import DarkMode from './DarkMode'
import Footer from './Footer/Footer'
import '../styles/Layout.css'

export default function Layout() {
  // CORRECTED: Call useAuth INSIDE the functional component
  const { user, logout } = useAuth()

  return (
    <div className='app-container'>
      <Navbar user={user} logout={logout} />
      <DarkMode />
      <main className='main-content'>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
