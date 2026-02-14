import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Calendar, ArrowRight } from 'lucide-react'

const BlogCard = ({ blog, index = 0 }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link to={`/blog/${blog.id}`}>
        <div className="bg-card rounded-2xl overflow-hidden card-hover group h-full flex flex-col">
          {/* Image */}
          {blog.image_url && (
            <div className="relative h-48 overflow-hidden">
              <img
                src={blog.image_url}
                alt={blog.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent" />
            </div>
          )}

          {/* Content */}
          <div className="p-6 flex-1 flex flex-col">
            {/* Date */}
            <div className="flex items-center text-text-muted text-sm mb-3">
              <Calendar size={14} className="mr-2" />
              <span>{formatDate(blog.created_at)}</span>
            </div>

            <h3 className="text-text-light font-bold text-xl mb-3 group-hover:text-accent-yellow transition-colors line-clamp-2">
              {blog.title}
            </h3>
            
            <p className="text-text-muted text-sm mb-4 line-clamp-3 flex-1">
              {blog.content?.substring(0, 150)}...
            </p>
            
            <div className="flex items-center text-accent-yellow font-medium text-sm group-hover:text-accent-gold transition-colors mt-auto">
              <span>Read More</span>
              <ArrowRight size={16} className="ml-2 group-hover:translate-x-2 transition-transform" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export default BlogCard
