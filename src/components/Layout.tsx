import { Outlet } from 'react-router-dom'
import { useAuth } from '../contexts/useAuth' // Import useAuth hook
import Navbar from './Layout/Navbar'
import DarkMode from './DarkMode' // Assuming this is another component in your Layout
import Footer from './Footer/Footer' // Assuming this is another component in your Layout
import '../styles/Layout.css' // Your layout specific styles

export default function Layout() {
  // CORRECTED: Call useAuth INSIDE the functional component
  const { user, logout } = useAuth()

  return (
    <div className='app-container'>
      {/* Pass user and logout to the Navbar */}
      <Navbar user={user} logout={logout} />
      <DarkMode /> {/* Assuming this is correctly positioned */}
      <main className='main-content'>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
