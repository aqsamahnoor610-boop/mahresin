import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, Eye, Loader2, ChevronDown, Package, Truck, CheckCircle, Clock } from 'lucide-react'
import { getOrders, updateOrderStatus } from '../../lib/api'
import toast from 'react-hot-toast'

const AdminOrders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [updating, setUpdating] = useState(false)

  const statusOptions = [
    { value: 'pending', label: 'Pending', color: 'text-yellow-400 bg-yellow-400/20', icon: Clock },
    { value: 'processing', label: 'Processing', color: 'text-blue-400 bg-blue-400/20', icon: Package },
    { value: 'shipped', label: 'Shipped', color: 'text-purple-400 bg-purple-400/20', icon: Truck },
    { value: 'delivered', label: 'Delivered', color: 'text-green-400 bg-green-400/20', icon: CheckCircle }
  ]

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const { data } = await getOrders()
      setOrders(data || [])
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdating(true)
    try {
      await updateOrderStatus(orderId, newStatus)
      toast.success(`Order status updated to ${newStatus}`)
      fetchOrders()
      if (selectedOrder?.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus })
      }
    } catch (error) {
      toast.error('Failed to update order status')
    } finally {
      setUpdating(false)
    }
  }

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id?.toString().includes(searchQuery) ||
      order.user_email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.shipping_address?.name?.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus

    return matchesSearch && matchesStatus
  })

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusBadge = (status) => {
    const statusInfo = statusOptions.find(s => s.value === status) || statusOptions[0]
    const Icon = statusInfo.icon
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
        <Icon size={12} />
        {statusInfo.label}
      </span>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-text-light font-['Playfair_Display']">
          Orders
        </h1>
        <p className="text-text-muted mt-1">Manage customer orders</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by order ID, email, or name..."
            className="w-full pl-12 pr-4 py-3 bg-card rounded-xl text-text-light placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-yellow/50"
          />
        </div>

        {/* Status Filter */}
        <div className="relative">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="appearance-none w-full md:w-48 px-4 py-3 bg-card rounded-xl text-text-light focus:outline-none focus:ring-2 focus:ring-accent-yellow/50 pr-10"
          >
            <option value="all">All Status</option>
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" size={18} />
        </div>
      </div>

      {/* Orders Table */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 text-accent-yellow animate-spin" />
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-12 bg-card rounded-2xl">
          <p className="text-text-muted">No orders found</p>
        </div>
      ) : (
        <div className="bg-card rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-accent-teal/20">
                  <th className="text-left py-4 px-6 text-text-muted text-sm font-medium">Order ID</th>
                  <th className="text-left py-4 px-6 text-text-muted text-sm font-medium">Customer</th>
                  <th className="text-left py-4 px-6 text-text-muted text-sm font-medium">Items</th>
                  <th className="text-left py-4 px-6 text-text-muted text-sm font-medium">Total</th>
                  <th className="text-left py-4 px-6 text-text-muted text-sm font-medium">Status</th>
                  <th className="text-left py-4 px-6 text-text-muted text-sm font-medium">Date</th>
                  <th className="text-right py-4 px-6 text-text-muted text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="border-b border-accent-teal/10 hover:bg-primary-dark/30">
                    <td className="py-4 px-6 text-text-light font-mono text-sm">
                      #{order.id?.toString().slice(0, 8)}
                    </td>
                    <td className="py-4 px-6">
                      <div>
                        <p className="text-text-light font-medium">{order.shipping_address?.name || 'N/A'}</p>
                        <p className="text-text-muted text-sm">{order.user_email}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-text-muted">
                      {order.items?.length || 0} items
                    </td>
                    <td className="py-4 px-6 text-accent-yellow font-semibold">
                      Rs. {order.total?.toLocaleString()}
                    </td>
                    <td className="py-4 px-6">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="py-4 px-6 text-text-muted text-sm">
                      {formatDate(order.created_at)}
                    </td>
                    <td className="py-4 px-6">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="p-2 text-text-muted hover:text-accent-yellow transition-colors"
                      >
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-text-light">
                  Order #{selectedOrder.id?.toString().slice(0, 8)}
                </h2>
                <p className="text-text-muted text-sm">{formatDate(selectedOrder.created_at)}</p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-text-muted hover:text-text-light"
              >
                ✕
              </button>
            </div>

            {/* Customer Info */}
            <div className="bg-primary-dark/50 rounded-xl p-4 mb-6">
              <h3 className="text-text-light font-semibold mb-3">Customer Information</h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-text-muted">Name</p>
                  <p className="text-text-light">{selectedOrder.shipping_address?.name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-text-muted">Email</p>
                  <p className="text-text-light">{selectedOrder.user_email}</p>
                </div>
                <div>
                  <p className="text-text-muted">Phone</p>
                  <p className="text-text-light">{selectedOrder.shipping_address?.phone || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-text-muted">Address</p>
                  <p className="text-text-light">
                    {selectedOrder.shipping_address?.address}, {selectedOrder.shipping_address?.city}
                  </p>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="mb-6">
              <h3 className="text-text-light font-semibold mb-3">Order Items</h3>
              <div className="space-y-3">
                {selectedOrder.items?.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 bg-primary-dark/50 rounded-xl p-3">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-primary-dark/50">
                      <img
                        src={item.images?.[0] || '/placeholder.jpg'}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-text-light font-medium">{item.title}</p>
                      <p className="text-text-muted text-sm">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-accent-yellow font-semibold">
                      Rs. {(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Total */}
            <div className="bg-primary-dark/50 rounded-xl p-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-text-muted">Total Amount</span>
                <span className="text-2xl font-bold text-accent-yellow">
                  Rs. {selectedOrder.total?.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Status Update */}
            <div>
              <h3 className="text-text-light font-semibold mb-3">Update Status</h3>
              <div className="flex flex-wrap gap-3">
                {statusOptions.map((option) => {
                  const Icon = option.icon
                  const isActive = selectedOrder.status === option.value
                  return (
                    <button
                      key={option.value}
                      onClick={() => handleStatusChange(selectedOrder.id, option.value)}
                      disabled={updating || isActive}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                        isActive
                          ? `${option.color} ring-2 ring-current`
                          : 'bg-primary-dark/50 text-text-muted hover:text-text-light'
                      } disabled:opacity-50`}
                    >
                      <Icon size={16} />
                      {option.label}
                    </button>
                  )
                })}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default AdminOrders
