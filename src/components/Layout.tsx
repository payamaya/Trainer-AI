import DarkMode from './DarkMode'
import { Outlet } from 'react-router-dom'
import '../styles/Layout.css'
import Footer from '../pages/Footer/Footer'
export default function Layout() {
  return (
    <div className='app-container'>
      <DarkMode />
      <div className='main-content'>
        <Outlet />
        <Footer />
      </div>
    </div>
  )
}
