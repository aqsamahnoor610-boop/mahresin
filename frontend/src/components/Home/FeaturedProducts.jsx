import { useState, useRef, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight, ShoppingCart, Heart } from 'lucide-react'
import { getFeaturedProducts } from '../../lib/api'
import { useCart } from '../../context/CartContext'
import { useWishlist } from '../../context/WishlistContext'

const FeaturedProducts = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const scrollRef = useRef(null)
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" })
  
  const { addToCart } = useCart()
  const { addToWishlist, isInWishlist, removeFromWishlist } = useWishlist()

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await getFeaturedProducts()
        // Only show products that are marked as featured
        setProducts(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error('Error fetching featured products:', error)
        // No dummy products - only show real products from database
        setProducts([])
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 320
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  const handleWishlistToggle = async (product) => {
    if (isInWishlist(product.id)) {
      await removeFromWishlist(product.id)
    } else {
      await addToWishlist(product.id)
    }
  }

  return (
    <section ref={sectionRef} className="py-24 px-4 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between mb-12"
        >
          <div>
            <span className="text-accent-yellow text-sm tracking-[0.3em] uppercase">
              New Arrivals
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mt-2 font-['Playfair_Display'] text-text-light">
              Featured <span className="gradient-text">Products</span>
            </h2>
          </div>
          <div className="flex items-center space-x-4 mt-6 md:mt-0">
            <button
              onClick={() => scroll('left')}
              className="w-12 h-12 bg-card rounded-full flex items-center justify-center text-text-light hover:bg-accent-yellow hover:text-primary-dark transition-all duration-300"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-12 h-12 bg-card rounded-full flex items-center justify-center text-text-light hover:bg-accent-yellow hover:text-primary-dark transition-all duration-300"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </motion.div>

        {/* Products Scroll Container */}
        {loading ? (
          <div className="flex space-x-6 overflow-hidden">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="min-w-[280px] h-[400px] bg-card rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16 bg-card rounded-2xl">
            <p className="text-text-muted text-lg">No featured products yet.</p>
            <p className="text-text-muted/70 mt-2">Check back soon for amazing resin art pieces!</p>
          </div>
        ) : (
          <div
            ref={scrollRef}
            className="flex space-x-6 overflow-x-auto hide-scrollbar snap-x pb-4"
          >
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="min-w-[280px] md:min-w-[300px] snap-center"
              >
                <div className="bg-card rounded-2xl overflow-hidden card-hover group">
                  {/* Image */}
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={product.images?.[0] || '/placeholder.jpg'}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent opacity-60" />
                    
                    {/* Quick Actions */}
                    <div className="absolute top-4 right-4 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleWishlistToggle(product)}
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
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
                        onClick={() => addToCart(product)}
                        className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center text-primary-dark hover:bg-accent-yellow transition-colors"
                      >
                        <ShoppingCart size={18} />
                      </motion.button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <Link to={`/product/${product.id}`}>
                      <h3 className="text-text-light font-semibold text-lg mb-2 hover:text-accent-yellow transition-colors line-clamp-1">
                        {product.title}
                      </h3>
                    </Link>
                    <div className="flex items-center justify-between">
                      <span className="text-accent-yellow font-bold text-xl">
                        Rs. {product.price?.toLocaleString()}
                      </span>
                      <Link
                        to={`/product/${product.id}`}
                        className="text-text-muted text-sm hover:text-accent-yellow transition-colors"
                      >
                        View Details →
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-12"
        >
          <Link to="/collections">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-transparent border-2 border-accent-yellow text-accent-yellow px-8 py-3 rounded-full font-semibold hover:bg-accent-yellow hover:text-primary-dark transition-all duration-300"
            >
              View All Products
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

export default FeaturedProducts
