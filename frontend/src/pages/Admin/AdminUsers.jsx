import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, Loader2, Users as UsersIcon, Mail, Phone, MapPin } from 'lucide-react'
import { getUsers } from '../../lib/api'

const AdminUsers = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const { data } = await getUsers()
      setUsers(data || [])
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredUsers = users.filter(user => {
    const searchLower = searchQuery.toLowerCase()
    return (
      user.email?.toLowerCase().includes(searchLower) ||
      user.full_name?.toLowerCase().includes(searchLower) ||
      user.phone?.includes(searchQuery)
    )
  })

  const formatDate = (date) => {
    if (!date) return 'N/A'
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-text-light font-['Playfair_Display']">
          Users
        </h1>
        <p className="text-text-muted mt-1">View registered users</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card rounded-2xl p-5">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-accent-yellow/20 rounded-xl">
              <UsersIcon className="w-6 h-6 text-accent-yellow" />
            </div>
            <div>
              <p className="text-text-muted text-sm">Total Users</p>
              <p className="text-2xl font-bold text-text-light">{users.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-2xl p-5">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-green-400/20 rounded-xl">
              <UsersIcon className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <p className="text-text-muted text-sm">This Month</p>
              <p className="text-2xl font-bold text-text-light">
                {users.filter(u => {
                  const created = new Date(u.created_at)
                  const now = new Date()
                  return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear()
                }).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-2xl p-5">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-purple-400/20 rounded-xl">
              <UsersIcon className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <p className="text-text-muted text-sm">Admins</p>
              <p className="text-2xl font-bold text-text-light">
                {users.filter(u => u.is_admin).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name, email, or phone..."
          className="w-full pl-12 pr-4 py-3 bg-card rounded-xl text-text-light placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-yellow/50"
        />
      </div>

      {/* Users List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 text-accent-yellow animate-spin" />
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="text-center py-12 bg-card rounded-2xl">
          <p className="text-text-muted">No users found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredUsers.map((user) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card rounded-2xl p-5"
            >
              {/* Avatar & Name */}
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-14 h-14 rounded-full bg-gradient-button flex items-center justify-center text-white text-xl font-bold">
                  {user.full_name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-text-light font-semibold truncate">
                    {user.full_name || 'No Name'}
                  </h3>
                  <div className="flex items-center gap-2">
                    {user.is_admin && (
                      <span className="px-2 py-0.5 bg-accent-yellow/20 text-accent-yellow text-xs rounded-full font-medium">
                        Admin
                      </span>
                    )}
                    <span className="text-text-muted/70 text-xs">
                      Joined {formatDate(user.created_at)}
                    </span>
                  </div>
                </div>
              </div>

              {/* User Details */}
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-3 text-text-muted">
                  <Mail size={16} className="flex-shrink-0" />
                  <span className="truncate">{user.email}</span>
                </div>
                {user.phone && (
                  <div className="flex items-center space-x-3 text-text-muted">
                    <Phone size={16} className="flex-shrink-0" />
                    <span>{user.phone}</span>
                  </div>
                )}
                {user.address && (
                  <div className="flex items-center space-x-3 text-text-muted">
                    <MapPin size={16} className="flex-shrink-0" />
                    <span className="truncate">{user.address}</span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AdminUsers
