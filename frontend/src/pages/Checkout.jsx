import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  User, 
  MapPin, 
  Phone, 
  FileText,
  CreditCard,
  Smartphone,
  Banknote,
  Truck,
  Check,
  Loader2
} from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { createOrder } from '../lib/api'
import toast from 'react-hot-toast'

const Checkout = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { cartItems, cartTotal, clearCart } = useCart()
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    notes: ''
  })
  const [paymentMethod, setPaymentMethod] = useState('cod')
  const [loading, setLoading] = useState(false)

  const paymentOptions = [
    { id: 'jazzcash', name: 'JazzCash', icon: Smartphone, color: 'text-red-400' },
    { id: 'easypaisa', name: 'EasyPaisa', icon: Smartphone, color: 'text-green-400' },
    { id: 'card', name: 'Debit Card', icon: CreditCard, color: 'text-blue-400' },
    { id: 'cod', name: 'Cash on Delivery', icon: Banknote, color: 'text-accent-yellow' },
  ]

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (cartItems.length === 0) {
      toast.error('Your cart is empty')
      return
    }

    setLoading(true)

    try {
      const orderData = {
        user_id: user?.id,
        items: cartItems.map(item => ({
          product_id: item.id,
          title: item.title,
          price: item.price,
          quantity: item.quantity,
          image: item.images?.[0]
        })),
        total_price: cartTotal,
        payment_method: paymentMethod,
        status: 'pending',
        shipping_info: {
          name: formData.name,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          notes: formData.notes
        }
      }

      await createOrder(orderData)
      
      clearCart()
      toast.success('Order placed successfully!')
      navigate('/my-orders')
    } catch (error) {
      toast.error('Failed to place order. Please try again.')
      console.error('Order error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (cartItems.length === 0) {
    navigate('/cart')
    return null
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-4xl font-bold text-text-light font-['Playfair_Display'] mb-8"
        >
          Checkout
        </motion.h1>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Shipping Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-2 space-y-6"
            >
              {/* Shipping Details */}
              <div className="bg-card rounded-2xl p-6">
                <h2 className="text-xl font-bold text-text-light mb-6 flex items-center">
                  <Truck className="mr-3 text-accent-yellow" size={24} />
                  Shipping Information
                </h2>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-text-light text-sm font-medium mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="Your full name"
                        className="w-full pl-12 pr-4 py-3 bg-primary-dark/50 rounded-xl text-text-light placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-yellow/50"
                      />
                    </div>
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
                        required
                        placeholder="+92 300 1234567"
                        className="w-full pl-12 pr-4 py-3 bg-primary-dark/50 rounded-xl text-text-light placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-yellow/50"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-text-light text-sm font-medium mb-2">
                      Address
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-4 text-text-muted" size={18} />
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                        rows={3}
                        placeholder="Complete delivery address"
                        className="w-full pl-12 pr-4 py-3 bg-primary-dark/50 rounded-xl text-text-light placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-yellow/50 resize-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-text-light text-sm font-medium mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                      placeholder="Your city"
                      className="w-full px-4 py-3 bg-primary-dark/50 rounded-xl text-text-light placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-yellow/50"
                    />
                  </div>

                  <div>
                    <label className="block text-text-light text-sm font-medium mb-2">
                      Order Notes (Optional)
                    </label>
                    <div className="relative">
                      <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                      <input
                        type="text"
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        placeholder="Any special instructions"
                        className="w-full pl-12 pr-4 py-3 bg-primary-dark/50 rounded-xl text-text-light placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-yellow/50"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-card rounded-2xl p-6">
                <h2 className="text-xl font-bold text-text-light mb-6 flex items-center">
                  <CreditCard className="mr-3 text-accent-yellow" size={24} />
                  Payment Method
                </h2>

                <div className="grid sm:grid-cols-2 gap-4">
                  {paymentOptions.map((option) => (
                    <motion.button
                      key={option.id}
                      type="button"
                      onClick={() => setPaymentMethod(option.id)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`p-4 rounded-xl border-2 flex items-center space-x-3 transition-all ${
                        paymentMethod === option.id
                          ? 'border-accent-yellow bg-accent-yellow/10'
                          : 'border-accent-teal/20 bg-primary-dark/30 hover:border-accent-teal/40'
                      }`}
                    >
                      <option.icon className={option.color} size={24} />
                      <span className="text-text-light font-medium">{option.name}</span>
                      {paymentMethod === option.id && (
                        <Check className="ml-auto text-accent-yellow" size={20} />
                      )}
                    </motion.button>
                  ))}
                </div>

                {paymentMethod !== 'cod' && (
                  <p className="text-text-muted text-sm mt-4 p-4 bg-primary-dark/30 rounded-xl">
                    ℹ️ Payment gateway integration coming soon. For now, your order will be marked as "Pending Payment".
                  </p>
                )}
              </div>
            </motion.div>

            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-card rounded-2xl p-6 h-fit sticky top-24"
            >
              <h2 className="text-xl font-bold text-text-light mb-6">Order Summary</h2>

              {/* Items */}
              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3">
                    <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.images?.[0] || '/placeholder.jpg'}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-text-light text-sm font-medium truncate">{item.title}</p>
                      <p className="text-text-muted text-xs">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-accent-yellow font-semibold text-sm">
                      Rs. {(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-3 border-t border-accent-teal/20 pt-4 mb-6">
                <div className="flex justify-between text-text-muted">
                  <span>Subtotal</span>
                  <span>Rs. {cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-text-muted">
                  <span>Shipping</span>
                  <span className="text-accent-yellow">Free</span>
                </div>
                <div className="flex justify-between text-text-light font-bold text-lg pt-2 border-t border-accent-teal/20">
                  <span>Total</span>
                  <span className="gradient-text">Rs. {cartTotal.toLocaleString()}</span>
                </div>
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-button text-white py-4 rounded-xl font-bold btn-glow disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="w-6 h-6 mx-auto animate-spin" />
                ) : (
                  'Place Order'
                )}
              </motion.button>
            </motion.div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Checkout
