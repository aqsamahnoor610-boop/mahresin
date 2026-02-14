import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Heart, ShoppingCart, Eye } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { useWishlist } from '../../context/WishlistContext'

const ProductCard = ({ product, index = 0 }) => {
  const { addToCart } = useCart()
  const { addToWishlist, isInWishlist, removeFromWishlist } = useWishlist()

  const handleWishlistToggle = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (isInWishlist(product.id)) {
      await removeFromWishlist(product.id)
    } else {
      await addToWishlist(product.id)
    }
  }

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart(product)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group"
    >
      <Link to={`/product/${product.id}`}>
        <div className="bg-card rounded-2xl overflow-hidden card-hover">
          {/* Image Container */}
          <div className="relative h-64 overflow-hidden">
            <img
              src={product.images?.[0] || '/placeholder.jpg'}
              alt={product.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent opacity-60" />
            
            {/* Stock Badge */}
            {product.stock !== undefined && product.stock <= 5 && product.stock > 0 && (
              <div className="absolute top-4 left-4 px-3 py-1 bg-accent-yellow/90 text-primary-dark text-xs font-semibold rounded-full">
                Only {product.stock} left
              </div>
            )}
            
            {product.stock === 0 && (
              <div className="absolute top-4 left-4 px-3 py-1 bg-red-500/90 text-white text-xs font-semibold rounded-full">
                Out of Stock
              </div>
            )}

            {/* Quick Actions */}
            <div className="absolute top-4 right-4 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleWishlistToggle}
                className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-colors ${
                  isInWishlist(product.id)
                    ? 'bg-red-500 text-white'
                    : 'bg-white/90 text-primary-dark hover:bg-accent-yellow'
                }`}
              >
                <Heart size={18} fill={isInWishlist(product.id) ? 'currentColor' : 'none'} />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center text-primary-dark hover:bg-accent-yellow transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingCart size={18} />
              </motion.button>
              
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center text-primary-dark hover:bg-accent-yellow transition-colors shadow-lg"
              >
                <Eye size={18} />
              </motion.div>
            </div>
          </div>

          {/* Content */}
          <div className="p-5">
            <h3 className="text-text-light font-semibold text-lg mb-2 group-hover:text-accent-yellow transition-colors line-clamp-1">
              {product.title}
            </h3>
            
            {product.description && (
              <p className="text-text-muted text-sm mb-3 line-clamp-2">
                {product.description}
              </p>
            )}
            
            <div className="flex items-center justify-between">
              <span className="text-accent-yellow font-bold text-xl">
                Rs. {product.price?.toLocaleString()}
              </span>
              <span className="text-text-muted text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                View Details →
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export default ProductCard
