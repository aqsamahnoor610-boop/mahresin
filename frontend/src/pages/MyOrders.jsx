import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Package, Clock, CheckCircle, Truck, XCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { getUserOrders } from '../lib/api'
import { PageLoader } from '../components/UI/LoadingSpinner'

const MyOrders = () => {
  const { user } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return
      try {
        const { data } = await getUserOrders(user.id)
        setOrders(data || [])
      } catch (error) {
        console.error('Error fetching orders:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [user])

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="text-yellow-400" size={20} />
      case 'processing':
        return <Package className="text-blue-400" size={20} />
      case 'shipped':
        return <Truck className="text-purple-400" size={20} />
      case 'delivered':
        return <CheckCircle className="text-green-400" size={20} />
      case 'cancelled':
        return <XCircle className="text-red-400" size={20} />
      default:
        return <Clock className="text-text-muted" size={20} />
    }
  }

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

  if (loading) return <PageLoader />

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-4xl font-bold text-text-light font-['Playfair_Display'] mb-8"
        >
          My Orders
        </motion.h1>

        {orders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 bg-card rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="w-12 h-12 text-text-muted" />
            </div>
            <h2 className="text-2xl font-bold text-text-light mb-2">No Orders Yet</h2>
            <p className="text-text-muted">You haven't placed any orders yet.</p>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {orders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-card rounded-2xl overflow-hidden"
              >
                {/* Order Header */}
                <div className="p-6 border-b border-accent-teal/20">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <p className="text-text-muted text-sm">Order ID</p>
                      <p className="text-text-light font-semibold">#{order.id}</p>
                    </div>
                    <div>
                      <p className="text-text-muted text-sm">Placed on</p>
                      <p className="text-text-light">
                        {new Date(order.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(order.status)}
                      <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-6">
                  <div className="space-y-4 mb-6">
                    {order.items?.map((item, i) => (
                      <div key={i} className="flex items-center space-x-4">
                        <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-primary-dark/50">
                          <img
                            src={item.image || '/placeholder.jpg'}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="text-text-light font-medium">{item.title}</p>
                          <p className="text-text-muted text-sm">
                            Qty: {item.quantity} × Rs. {item.price?.toLocaleString()}
                          </p>
                        </div>
                        <p className="text-accent-yellow font-semibold">
                          Rs. {(item.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Order Total */}
                  <div className="flex justify-between items-center pt-4 border-t border-accent-teal/20">
                    <div>
                      <p className="text-text-muted text-sm">Payment Method</p>
                      <p className="text-text-light capitalize">{order.payment_method?.replace('_', ' ')}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-text-muted text-sm">Total Amount</p>
                      <p className="text-2xl font-bold gradient-text">
                        Rs. {order.total_price?.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default MyOrders
