import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  ChevronLeft, 
  Heart, 
  ShoppingCart, 
  Minus, 
  Plus, 
  Star,
  Share2,
  Truck,
  Shield,
  RefreshCw
} from 'lucide-react'
import { getProduct, getProducts, getProductReviews, createReview } from '../lib/api'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { useAuth } from '../context/AuthContext'
import ProductCard from '../components/UI/ProductCard'
import { PageLoader } from '../components/UI/LoadingSpinner'
import toast from 'react-hot-toast'

const ProductDetail = () => {
  const { id } = useParams()
  const { user } = useAuth()
  const { addToCart } = useCart()
  const { addToWishlist, isInWishlist, removeFromWishlist } = useWishlist()

  const [product, setProduct] = useState(null)
  const [relatedProducts, setRelatedProducts] = useState([])
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [reviewText, setReviewText] = useState('')
  const [reviewRating, setReviewRating] = useState(5)
  const [submittingReview, setSubmittingReview] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        console.log('Fetching product:', id)
        const productRes = await getProduct(id)
        console.log('Product response:', productRes)
        
        if (!productRes.data) {
          console.error('No product data received')
          setProduct(null)
          setLoading(false)
          return
        }
        
        setProduct(productRes.data)
        
        // Fetch reviews (don't fail if reviews fail)
        try {
          const reviewsRes = await getProductReviews(id)
          setReviews(reviewsRes.data || [])
        } catch (e) {
          console.log('Reviews not available:', e)
          setReviews([])
        }

        // Fetch related products
        try {
          const productsRes = await getProducts({ limit: 4 })
          const filtered = (productsRes.data || []).filter(p => p.id !== id)
          setRelatedProducts(filtered.slice(0, 4))
        } catch (e) {
          console.log('Related products not available:', e)
        }
      } catch (error) {
        console.error('Error fetching product:', error)
        setProduct(null)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
    setSelectedImage(0)
    setQuantity(1)
  }, [id])

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity)
    }
  }

  const handleWishlistToggle = async () => {
    if (isInWishlist(product.id)) {
      await removeFromWishlist(product.id)
    } else {
      await addToWishlist(product.id)
    }
  }

  const handleSubmitReview = async (e) => {
    e.preventDefault()
    if (!user) {
      toast.error('Please login to write a review')
      return
    }
    if (!reviewText.trim()) return

    setSubmittingReview(true)
    try {
      await createReview({
        product_id: id,
        user_id: user.id,
        rating: reviewRating,
        comment: reviewText
      })
      toast.success('Review submitted successfully!')
      setReviewText('')
      setReviewRating(5)
      // Refresh reviews
      const { data } = await getProductReviews(id)
      setReviews(data || [])
    } catch (error) {
      toast.error('Failed to submit review')
    } finally {
      setSubmittingReview(false)
    }
  }

  if (loading) return <PageLoader />
  if (!product) return <div className="min-h-screen flex items-center justify-center text-text-light">Product not found</div>

  const images = product.images?.length > 0 ? product.images : ['/placeholder.jpg']

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <Link
          to="/collections"
          className="inline-flex items-center text-accent-yellow hover:text-accent-gold transition-colors mb-8"
        >
          <ChevronLeft size={20} />
          <span>Back to Products</span>
        </Link>

        {/* Product Section */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Images */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Main Image */}
            <div className="relative h-96 md:h-[500px] bg-card rounded-2xl overflow-hidden mb-4">
              <img
                src={images[selectedImage]}
                alt={product.title}
                className="w-full h-full object-cover"
              />
              {product.stock <= 5 && product.stock > 0 && (
                <div className="absolute top-4 left-4 px-3 py-1 bg-accent-yellow text-primary-dark text-sm font-semibold rounded-full">
                  Only {product.stock} left!
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex space-x-3 overflow-x-auto hide-scrollbar">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden transition-all ${
                      selectedImage === index
                        ? 'ring-2 ring-accent-yellow'
                        : 'opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-text-light font-['Playfair_Display']">
                {product.title}
              </h1>
              
              {/* Rating */}
              <div className="flex items-center space-x-2 mt-3">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={18}
                      className={star <= 4 ? 'text-accent-yellow fill-accent-yellow' : 'text-text-muted'}
                    />
                  ))}
                </div>
                <span className="text-text-muted text-sm">({reviews.length} reviews)</span>
              </div>
            </div>

            {/* Price */}
            <div className="text-4xl font-bold gradient-text">
              Rs. {product.price?.toLocaleString()}
            </div>

            {/* Description */}
            <p className="text-text-muted leading-relaxed">
              {product.description}
            </p>

            {/* Quantity */}
            <div className="flex items-center space-x-4">
              <span className="text-text-light font-medium">Quantity:</span>
              <div className="flex items-center bg-card rounded-xl">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 text-text-muted hover:text-accent-yellow transition-colors"
                >
                  <Minus size={18} />
                </button>
                <span className="px-4 text-text-light font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-3 text-text-muted hover:text-accent-yellow transition-colors"
                >
                  <Plus size={18} />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 flex items-center justify-center space-x-2 bg-gradient-button text-white py-4 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed btn-glow"
              >
                <ShoppingCart size={20} />
                <span>{product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleWishlistToggle}
                className={`px-6 py-4 rounded-xl font-semibold flex items-center justify-center space-x-2 transition-colors ${
                  isInWishlist(product.id)
                    ? 'bg-red-500 text-white'
                    : 'bg-card text-text-light hover:bg-card/80'
                }`}
              >
                <Heart size={20} fill={isInWishlist(product.id) ? 'currentColor' : 'none'} />
                <span className="sm:hidden">Wishlist</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-4 rounded-xl bg-card text-text-light hover:bg-card/80 font-semibold"
              >
                <Share2 size={20} />
              </motion.button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-accent-teal/20">
              <div className="text-center">
                <Truck className="mx-auto text-accent-yellow mb-2" size={24} />
                <p className="text-text-muted text-xs">Free Shipping</p>
              </div>
              <div className="text-center">
                <Shield className="mx-auto text-accent-yellow mb-2" size={24} />
                <p className="text-text-muted text-xs">Secure Payment</p>
              </div>
              <div className="text-center">
                <RefreshCw className="mx-auto text-accent-yellow mb-2" size={24} />
                <p className="text-text-muted text-xs">Easy Returns</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Reviews Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-text-light mb-8 font-['Playfair_Display']">
            Customer Reviews
          </h2>

          {/* Review Form */}
          <div className="bg-card rounded-2xl p-6 mb-8">
            <h3 className="text-lg font-semibold text-text-light mb-4">Write a Review</h3>
            <form onSubmit={handleSubmitReview}>
              {/* Rating */}
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-text-muted text-sm">Rating:</span>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className="p-1"
                    >
                      <Star
                        size={24}
                        className={star <= reviewRating ? 'text-accent-yellow fill-accent-yellow' : 'text-text-muted'}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Share your experience with this product..."
                rows={4}
                className="w-full px-4 py-3 bg-primary-dark/50 rounded-xl text-text-light placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-yellow/50 mb-4"
              />

              <motion.button
                type="submit"
                disabled={submittingReview || !reviewText.trim()}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-accent-yellow text-primary-dark px-6 py-3 rounded-xl font-semibold disabled:opacity-50"
              >
                {submittingReview ? 'Submitting...' : 'Submit Review'}
              </motion.button>
            </form>
          </div>

          {/* Reviews List */}
          {reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.map((review, index) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-card rounded-2xl p-6"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-button rounded-full flex items-center justify-center text-white font-semibold">
                        {review.user_email?.[0]?.toUpperCase() || 'U'}
                      </div>
                      <div>
                        <p className="text-text-light font-medium">{review.user_email || 'Customer'}</p>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              size={14}
                              className={star <= review.rating ? 'text-accent-yellow fill-accent-yellow' : 'text-text-muted'}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <span className="text-text-muted text-sm">
                      {new Date(review.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-text-muted">{review.comment}</p>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-text-muted text-center py-8">No reviews yet. Be the first to review!</p>
          )}
        </section>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-text-light mb-8 font-['Playfair_Display']">
              You May Also Like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

export default ProductDetail
