import { Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

const AdminRoute = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(null)

  useEffect(() => {
    // Check localStorage for admin session
    const adminData = localStorage.getItem('mahresin_admin')
    
    if (adminData) {
      try {
        const parsed = JSON.parse(adminData)
        // Check if session is valid (less than 24 hours old)
        const isValid = parsed.isAdmin && (Date.now() - parsed.loginTime) < 24 * 60 * 60 * 1000
        setIsAdmin(isValid)
      } catch {
        setIsAdmin(false)
      }
    } else {
      setIsAdmin(false)
    }
  }, [])

  // Still checking
  if (isAdmin === null) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-[#0F4A3A] to-[#0B3F33]">
        <div className="w-8 h-8 border-2 border-[#F4B400] border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  // Not admin - redirect to login
  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />
  }

  return children
}

export default AdminRoute
