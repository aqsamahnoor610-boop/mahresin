import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, Loader2, Shield } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      console.log('Attempting login for:', formData.email)
      
      // Simple local auth check for admin
      if (formData.email === 'admin@mahresin.com' && formData.password === 'mahresin2026') {
        // Store admin session in localStorage
        localStorage.setItem('mahresin_admin', JSON.stringify({
          email: formData.email,
          isAdmin: true,
          loginTime: Date.now()
        }))
        
        toast.success('Welcome to Admin Panel!')
        console.log('Admin login successful, redirecting...')
        window.location.href = '/admin'
        return
      }

      // Wrong credentials
      throw new Error('Invalid email or password')
      
    } catch (error) {
      console.error('Login error:', error)
      toast.error(error.message || 'Failed to sign in')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-main flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="bg-card rounded-2xl p-8 md:p-10 shadow-card">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-button rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="text-white" size={32} />
            </div>
            <h1 className="text-3xl font-bold text-text-light font-['Playfair_Display']">
              Admin Login
            </h1>
            <p className="text-text-muted mt-2">Access the admin dashboard</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-text-light text-sm font-medium mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="admin@example.com"
                  className="w-full pl-12 pr-4 py-3 bg-primary-dark/50 rounded-xl text-text-light placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-yellow/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-text-light text-sm font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Enter your password"
                  className="w-full pl-12 pr-12 py-3 bg-primary-dark/50 rounded-xl text-text-light placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-yellow/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-light"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-button text-white py-4 rounded-xl font-bold text-lg btn-glow disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-6 h-6 mx-auto animate-spin" />
              ) : (
                'Access Dashboard'
              )}
            </motion.button>
          </form>

          <p className="text-center text-text-muted text-sm mt-6">
            Not an admin?{' '}
            <a href="/" className="text-accent-yellow hover:text-accent-gold">
              Go back to website
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export default AdminLogin
