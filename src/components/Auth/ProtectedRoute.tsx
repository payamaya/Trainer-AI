import { useContext } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { AuthContext } from '../../contexts/AuthContext'

const ProtectedRoute = () => {
  const authContext = useContext(AuthContext)

  if (!authContext) {
    // Or a loading state for when the context is not yet loaded
    return <div>Loading...</div>
  }

  // Check if a user is logged in
  if (!authContext.user) {
    // If not, redirect them to the home page or login page
    return <Navigate to='/' replace />
  }

  // If a user is logged in, render the child route
  return <Outlet />
}

export default ProtectedRoute
