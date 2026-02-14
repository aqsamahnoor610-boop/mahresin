import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Package, 
  FolderOpen, 
  ShoppingCart, 
  Users,
  TrendingUp,
  DollarSign,
  Eye,
  ArrowUpRight
} from 'lucide-react'
import { getProducts, getCollections, getOrders, getUsers } from '../../lib/api'

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    products: 0,
    collections: 0,
    orders: 0,
    users: 0,
    revenue: 0,
    pendingOrders: 0
  })
  const [recentOrders, setRecentOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [productsRes, collectionsRes, ordersRes, usersRes] = await Promise.all([
          getProducts(),
          getCollections(),
          getOrders(),
          getUsers()
        ])

        const orders = ordersRes.data || []
        const revenue = orders.reduce((sum, order) => sum + (order.total_price || 0), 0)
        const pending = orders.filter(o => o.status === 'pending').length

        setStats({
          products: productsRes.data?.length || 0,
          collections: collectionsRes.data?.length || 0,
          orders: orders.length,
          users: usersRes.data?.length || 0,
          revenue,
          pendingOrders: pending
        })

        setRecentOrders(orders.slice(0, 5))
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  const statCards = [
    { title: 'Total Products', value: stats.products, icon: Package, color: 'text-blue-400', bg: 'bg-blue-400/20' },
    { title: 'Collections', value: stats.collections, icon: FolderOpen, color: 'text-purple-400', bg: 'bg-purple-400/20' },
    { title: 'Total Orders', value: stats.orders, icon: ShoppingCart, color: 'text-green-400', bg: 'bg-green-400/20' },
    { title: 'Total Users', value: stats.users, icon: Users, color: 'text-accent-yellow', bg: 'bg-accent-yellow/20' },
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-400/20 text-yellow-400'
      case 'processing':
        return 'bg-blue-400/20 text-blue-400'
      case 'shipped':
        return 'bg-purple-400/20 text-purple-400'
      case 'delivered':
        return 'bg-green-400/20 text-green-400'
      case 'cancelled':
        return 'bg-red-400/20 text-red-400'
      default:
        return 'bg-text-muted/20 text-text-muted'
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-text-light font-['Playfair_Display']">
          Dashboard
        </h1>
        <p className="text-text-muted mt-1">Welcome back! Here's what's happening.</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-card rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center`}>
                <stat.icon className={stat.color} size={24} />
              </div>
              <ArrowUpRight className="text-green-400" size={20} />
            </div>
            <p className="text-text-muted text-sm">{stat.title}</p>
            <p className="text-3xl font-bold text-text-light mt-1">
              {loading ? '...' : stat.value}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Revenue & Pending Orders */}
      <div className="grid md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-card rounded-2xl p-6"
        >
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-green-400/20 rounded-xl flex items-center justify-center">
              <DollarSign className="text-green-400" size={24} />
            </div>
            <div>
              <p className="text-text-muted text-sm">Total Revenue</p>
              <p className="text-3xl font-bold gradient-text">
                Rs. {loading ? '...' : stats.revenue.toLocaleString()}
              </p>
            </div>
          </div>
          <div className="flex items-center text-green-400 text-sm">
            <TrendingUp size={16} className="mr-1" />
            <span>From all orders</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-card rounded-2xl p-6"
        >
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-yellow-400/20 rounded-xl flex items-center justify-center">
              <Eye className="text-yellow-400" size={24} />
            </div>
            <div>
              <p className="text-text-muted text-sm">Pending Orders</p>
              <p className="text-3xl font-bold text-accent-yellow">
                {loading ? '...' : stats.pendingOrders}
              </p>
            </div>
          </div>
          <p className="text-text-muted text-sm">Orders awaiting action</p>
        </motion.div>
      </div>

      {/* Recent Orders */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-card rounded-2xl p-6"
      >
        <h2 className="text-xl font-bold text-text-light mb-6">Recent Orders</h2>
        
        {recentOrders.length === 0 ? (
          <p className="text-text-muted text-center py-8">No orders yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-accent-teal/20">
                  <th className="text-left py-3 px-4 text-text-muted text-sm font-medium">Order ID</th>
                  <th className="text-left py-3 px-4 text-text-muted text-sm font-medium">Customer</th>
                  <th className="text-left py-3 px-4 text-text-muted text-sm font-medium">Amount</th>
                  <th className="text-left py-3 px-4 text-text-muted text-sm font-medium">Status</th>
                  <th className="text-left py-3 px-4 text-text-muted text-sm font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-accent-teal/10 hover:bg-primary-dark/30">
                    <td className="py-4 px-4 text-text-light">#{order.id}</td>
                    <td className="py-4 px-4 text-text-light">
                      {order.shipping_info?.name || 'Customer'}
                    </td>
                    <td className="py-4 px-4 text-accent-yellow font-semibold">
                      Rs. {order.total_price?.toLocaleString()}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-text-muted text-sm">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default AdminDashboard
