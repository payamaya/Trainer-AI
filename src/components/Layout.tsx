import DarkMode from './DarkMode'
import { Outlet } from 'react-router-dom'
export default function Layout() {
  return (
    <div className='app-container'>
      <DarkMode />
      <Outlet /> {/* This renders your current route */}
    </div>
  )
}
