import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { getBlogs } from '../lib/api'
import BlogCard from '../components/UI/BlogCard'
import { PageLoader } from '../components/UI/LoadingSpinner'

const Blog = () => {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const { data } = await getBlogs()
        setBlogs(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error('Error fetching blogs:', error)
        setBlogs([])
      } finally {
        setLoading(false)
      }
    }
    fetchBlogs()
  }, [])

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-accent-yellow text-sm tracking-[0.3em] uppercase">
              Insights & Stories
            </span>
            <h1 className="text-5xl md:text-6xl font-bold mt-2 font-['Playfair_Display'] text-text-light">
              Our Blog
            </h1>
            <p className="text-text-muted mt-4 max-w-2xl mx-auto text-lg">
              Discover tips, tutorials, and stories from the world of resin art. 
              Learn new techniques and get inspired by our creative journey.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="pb-24 px-4">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <PageLoader />
          ) : blogs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((blog, index) => (
                <BlogCard key={blog.id} blog={blog} index={index} />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="w-24 h-24 bg-card rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">📝</span>
              </div>
              <h3 className="text-text-light text-xl font-semibold mb-2">
                No Blog Posts Yet
              </h3>
              <p className="text-text-muted">
                Stay tuned for exciting articles about resin art!
              </p>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  )
}

export default Blog
