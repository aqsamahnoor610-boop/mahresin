import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, Trash2, ShoppingCart } from 'lucide-react'
import { useWishlist } from '../context/WishlistContext'
import { useCart } from '../context/CartContext'
import { PageLoader } from '../components/UI/LoadingSpinner'

const Wishlist = () => {
  const { wishlistItems, loading, removeFromWishlist } = useWishlist()
  const { addToCart } = useCart()

  const handleMoveToCart = (product) => {
    addToCart(product)
    removeFromWishlist(product.id)
  }

  if (loading) return <PageLoader />

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-24 h-24 bg-card rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="w-12 h-12 text-text-muted" />
          </div>
          <h2 className="text-2xl font-bold text-text-light mb-2">Your Wishlist is Empty</h2>
          <p className="text-text-muted mb-8">Save your favorite items here for later.</p>
          <Link to="/collections">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-button text-white px-8 py-3 rounded-full font-semibold btn-glow"
            >
              Explore Collections
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
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-text-light font-['Playfair_Display']">
            My Wishlist
          </h1>
          <p className="text-text-muted mt-2">{wishlistItems.length} items saved</p>
        </motion.div>

        {/* Wishlist Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-card rounded-2xl overflow-hidden group"
            >
              {/* Image */}
              <Link to={`/product/${item.product?.id || item.product_id}`}>
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={item.product?.images?.[0] || '/placeholder.jpg'}
                    alt={item.product?.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent opacity-60" />
                </div>
              </Link>

              {/* Content */}
              <div className="p-5">
                <Link to={`/product/${item.product?.id || item.product_id}`}>
                  <h3 className="text-text-light font-semibold text-lg mb-2 hover:text-accent-yellow transition-colors line-clamp-1">
                    {item.product?.title || 'Product'}
                  </h3>
                </Link>
                <p className="text-accent-yellow font-bold text-xl mb-4">
                  Rs. {item.product?.price?.toLocaleString() || '0'}
                </p>

                {/* Actions */}
                <div className="flex space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleMoveToCart(item.product)}
                    className="flex-1 flex items-center justify-center space-x-2 bg-gradient-button text-white py-3 rounded-xl font-semibold text-sm"
                  >
                    <ShoppingCart size={16} />
                    <span>Add to Cart</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => removeFromWishlist(item.product_id)}
                    className="p-3 bg-red-500/20 text-red-400 rounded-xl hover:bg-red-500/30 transition-colors"
                  >
                    <Trash2 size={18} />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Wishlist
