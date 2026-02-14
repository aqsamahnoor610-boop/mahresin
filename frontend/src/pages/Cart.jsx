import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react'
import { useCart } from '../context/CartContext'

const Cart = () => {
  const { cartItems, cartTotal, updateQuantity, removeFromCart, clearCart } = useCart()

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-24 h-24 bg-card rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-12 h-12 text-text-muted" />
          </div>
          <h2 className="text-2xl font-bold text-text-light mb-2">Your Cart is Empty</h2>
          <p className="text-text-muted mb-8">Looks like you haven't added any items yet.</p>
          <Link to="/collections">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-button text-white px-8 py-3 rounded-full font-semibold btn-glow"
            >
              Start Shopping
            </motion.button>
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-text-light font-['Playfair_Display']">
            Shopping Cart
          </h1>
          <button
            onClick={clearCart}
            className="text-red-400 hover:text-red-300 text-sm flex items-center space-x-2"
          >
            <Trash2 size={16} />
            <span>Clear Cart</span>
          </button>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-card rounded-2xl p-4 md:p-6 flex flex-col sm:flex-row gap-4"
              >
                {/* Image */}
                <div className="w-full sm:w-32 h-32 rounded-xl overflow-hidden flex-shrink-0">
                  <img
                    src={item.images?.[0] || '/placeholder.jpg'}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <Link 
                        to={`/product/${item.id}`}
                        className="text-text-light font-semibold text-lg hover:text-accent-yellow transition-colors"
                      >
                        {item.title}
                      </Link>
                      <p className="text-accent-yellow font-bold text-lg mt-1">
                        Rs. {item.price?.toLocaleString()}
                      </p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-400 hover:text-red-300 p-2"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  {/* Quantity */}
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center bg-primary-dark/50 rounded-xl">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-2 text-text-muted hover:text-accent-yellow transition-colors"
                      >
                        <Minus size={18} />
                      </button>
                      <span className="px-4 text-text-light font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-2 text-text-muted hover:text-accent-yellow transition-colors"
                      >
                        <Plus size={18} />
                      </button>
                    </div>
                    <p className="text-text-light font-bold">
                      Rs. {(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card rounded-2xl p-6 h-fit sticky top-24"
          >
            <h2 className="text-xl font-bold text-text-light mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-text-muted">
                <span>Subtotal</span>
                <span>Rs. {cartTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-text-muted">
                <span>Shipping</span>
                <span className="text-accent-yellow">Free</span>
              </div>
              <div className="border-t border-accent-teal/20 pt-4 flex justify-between text-text-light font-bold text-lg">
                <span>Total</span>
                <span className="gradient-text">Rs. {cartTotal.toLocaleString()}</span>
              </div>
            </div>

            <Link to="/checkout">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-center space-x-2 bg-gradient-button text-white py-4 rounded-xl font-semibold btn-glow"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight size={18} />
              </motion.button>
            </Link>

            <Link 
              to="/collections"
              className="block text-center text-accent-yellow mt-4 hover:text-accent-gold transition-colors"
            >
              Continue Shopping
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Cart
