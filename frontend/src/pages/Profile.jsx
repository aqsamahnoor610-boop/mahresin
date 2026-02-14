import { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Mail, Phone, MapPin, Save, Loader2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'

const Profile = () => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    full_name: user?.user_metadata?.full_name || '',
    phone: user?.user_metadata?.phone || '',
    address: user?.user_metadata?.address || ''
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase.auth.updateUser({
        data: formData
      })

      if (error) throw error

      toast.success('Profile updated successfully!')
    } catch (error) {
      toast.error('Failed to update profile')
      console.error('Profile update error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl p-8"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-gradient-button rounded-full flex items-center justify-center mx-auto mb-4">
              <User size={40} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold text-text-light font-['Playfair_Display']">
              My Profile
            </h1>
            <p className="text-text-muted mt-2">{user?.email}</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-text-light text-sm font-medium mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  placeholder="Your full name"
                  className="w-full pl-12 pr-4 py-3 bg-primary-dark/50 rounded-xl text-text-light placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-yellow/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-text-light text-sm font-medium mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                <input
                  type="email"
                  value={user?.email}
                  disabled
                  className="w-full pl-12 pr-4 py-3 bg-primary-dark/30 rounded-xl text-text-muted cursor-not-allowed"
                />
              </div>
              <p className="text-text-muted text-xs mt-1">Email cannot be changed</p>
            </div>

            <div>
              <label className="block text-text-light text-sm font-medium mb-2">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+92 300 1234567"
                  className="w-full pl-12 pr-4 py-3 bg-primary-dark/50 rounded-xl text-text-light placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-yellow/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-text-light text-sm font-medium mb-2">
                Address
              </label>
              <div className="relative">
                <MapPin className="absolute left-4 top-4 text-text-muted" size={18} />
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Your delivery address"
                  className="w-full pl-12 pr-4 py-3 bg-primary-dark/50 rounded-xl text-text-light placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-yellow/50 resize-none"
                />
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center space-x-2 bg-gradient-button text-white py-4 rounded-xl font-semibold btn-glow disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Save size={20} />
                  <span>Save Changes</span>
                </>
              )}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  )
}

export default Profile
