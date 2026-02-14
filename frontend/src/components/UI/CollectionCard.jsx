import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

const CollectionCard = ({ collection, index = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link to={`/collections/${collection.id}`}>
        <div className="bg-card rounded-2xl overflow-hidden card-hover group h-full">
          {/* Image */}
          <div className="relative h-56 md:h-64 overflow-hidden">
            <img
              src={collection.image_url || '/placeholder.jpg'}
              alt={collection.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
            
            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-accent-yellow/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>

          {/* Content */}
          <div className="p-6">
            <h3 className="text-text-light font-bold text-xl mb-2 group-hover:text-accent-yellow transition-colors">
              {collection.title}
            </h3>
            
            {collection.description && (
              <p className="text-text-muted text-sm mb-4 line-clamp-2">
                {collection.description}
              </p>
            )}
            
            <div className="flex items-center text-accent-yellow font-medium text-sm group-hover:text-accent-gold transition-colors">
              <span>Explore Collection</span>
              <ArrowRight size={16} className="ml-2 group-hover:translate-x-2 transition-transform" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export default CollectionCard
