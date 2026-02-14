import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronLeft, Grid3X3, LayoutGrid, SlidersHorizontal } from 'lucide-react'
import { getCollection, getProductsByCollection } from '../lib/api'
import ProductCard from '../components/UI/ProductCard'
import { PageLoader } from '../components/UI/LoadingSpinner'

const CollectionProducts = () => {
  const { id } = useParams()
  const [collection, setCollection] = useState(null)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [gridCols, setGridCols] = useState(3)
  const [sortBy, setSortBy] = useState('newest')
  const [filterOpen, setFilterOpen] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [collectionRes, productsRes] = await Promise.all([
          getCollection(id),
          getProductsByCollection(id)
        ])
        setCollection(collectionRes.data)
        setProducts(productsRes.data || [])
      } catch (error) {
        console.error('Error fetching collection:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id])

  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price
      case 'price-high':
        return b.price - a.price
      case 'name':
        return a.title.localeCompare(b.title)
      case 'newest':
      default:
        return new Date(b.created_at) - new Date(a.created_at)
    }
  })

  if (loading) return <PageLoader />

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 md:py-32">
        {collection?.image_url && (
          <div className="absolute inset-0">
            <img
              src={collection.image_url}
              alt={collection.title}
              className="w-full h-full object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-primary-dark via-primary-dark/90 to-primary-dark" />
          </div>
        )}
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <Link
            to="/collections"
            className="inline-flex items-center text-accent-yellow hover:text-accent-gold transition-colors mb-6"
          >
            <ChevronLeft size={20} />
            <span>Back to Collections</span>
          </Link>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold font-['Playfair_Display'] text-text-light">
              {collection?.title || 'Collection'}
            </h1>
            {collection?.description && (
              <p className="text-text-muted mt-4 max-w-2xl text-lg">
                {collection.description}
              </p>
            )}
          </motion.div>
        </div>
      </section>

      {/* Controls */}
      <section className="py-6 px-4 border-b border-accent-teal/20">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-text-muted">
            {products.length} {products.length === 1 ? 'product' : 'products'} found
          </p>
          
          <div className="flex items-center space-x-4">
            {/* Grid Toggle */}
            <div className="flex items-center bg-card rounded-lg p-1">
              <button
                onClick={() => setGridCols(3)}
                className={`p-2 rounded-md transition-colors ${
                  gridCols === 3 ? 'bg-accent-yellow text-primary-dark' : 'text-text-muted hover:text-text-light'
                }`}
              >
                <Grid3X3 size={18} />
              </button>
              <button
                onClick={() => setGridCols(4)}
                className={`p-2 rounded-md transition-colors ${
                  gridCols === 4 ? 'bg-accent-yellow text-primary-dark' : 'text-text-muted hover:text-text-light'
                }`}
              >
                <LayoutGrid size={18} />
              </button>
            </div>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-card text-text-light px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-yellow/50 cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name: A-Z</option>
            </select>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {sortedProducts.length > 0 ? (
            <div className={`grid gap-6 ${
              gridCols === 4 
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
            }`}>
              {sortedProducts.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  index={index}
                />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="w-24 h-24 bg-card rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">📦</span>
              </div>
              <h3 className="text-text-light text-xl font-semibold mb-2">
                No Products Yet
              </h3>
              <p className="text-text-muted">
                This collection is being prepared. Check back soon!
              </p>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  )
}

export default CollectionProducts
