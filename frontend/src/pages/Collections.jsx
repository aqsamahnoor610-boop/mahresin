import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { getCollections } from '../lib/api'
import CollectionCard from '../components/UI/CollectionCard'
import { PageLoader } from '../components/UI/LoadingSpinner'

const Collections = () => {
  const [collections, setCollections] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const { data } = await getCollections()
        setCollections(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error('Error fetching collections:', error)
        setCollections([])
      } finally {
        setLoading(false)
      }
    }
    fetchCollections()
  }, [])

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-b from-primary-dark/50 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-accent-yellow text-sm tracking-[0.3em] uppercase">
              Browse Our
            </span>
            <h1 className="text-5xl md:text-6xl font-bold mt-2 font-['Playfair_Display'] text-text-light">
              Collections
            </h1>
            <p className="text-text-muted mt-4 max-w-2xl mx-auto text-lg">
              Explore our curated collections of handcrafted resin art pieces, 
              each designed to bring beauty and elegance to your space.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Collections Grid */}
      <section className="pb-24 px-4">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <PageLoader />
          ) : collections.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {collections.map((collection, index) => (
                <CollectionCard
                  key={collection.id}
                  collection={collection}
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
                <span className="text-4xl">🎨</span>
              </div>
              <h3 className="text-text-light text-xl font-semibold mb-2">
                No Collections Yet
              </h3>
              <p className="text-text-muted">
                Check back soon for our beautiful resin art collections!
              </p>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  )
}

export default Collections
