import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronLeft, Calendar, Clock, Share2 } from 'lucide-react'
import { getBlog } from '../lib/api'
import { PageLoader } from '../components/UI/LoadingSpinner'

const BlogDetail = () => {
  const { id } = useParams()
  const [blog, setBlog] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const { data } = await getBlog(id)
        setBlog(data)
      } catch (error) {
        console.error('Error fetching blog:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchBlog()
  }, [id])

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const calculateReadTime = (content) => {
    const wordsPerMinute = 200
    const words = content?.split(/\s+/).length || 0
    return Math.ceil(words / wordsPerMinute)
  }

  if (loading) return <PageLoader />
  if (!blog) return <div className="min-h-screen flex items-center justify-center text-text-light">Blog post not found</div>

  return (
    <div className="min-h-screen">
      {/* Hero Image */}
      {blog.image_url && (
        <div className="relative h-64 md:h-96">
          <img
            src={blog.image_url}
            alt={blog.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary-dark via-primary-dark/50 to-transparent" />
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Back Link */}
        <Link
          to="/blog"
          className="inline-flex items-center text-accent-yellow hover:text-accent-gold transition-colors mb-8"
        >
          <ChevronLeft size={20} />
          <span>Back to Blog</span>
        </Link>

        {/* Article */}
        <article>
          <motion.header
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-text-light font-['Playfair_Display'] leading-tight">
              {blog.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 mt-6 text-text-muted">
              <div className="flex items-center space-x-2">
                <Calendar size={16} />
                <span>{formatDate(blog.created_at)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock size={16} />
                <span>{calculateReadTime(blog.content)} min read</span>
              </div>
              <button className="flex items-center space-x-2 hover:text-accent-yellow transition-colors ml-auto">
                <Share2 size={16} />
                <span>Share</span>
              </button>
            </div>
          </motion.header>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="prose prose-invert prose-lg max-w-none"
          >
            <div className="text-text-light/80 leading-relaxed whitespace-pre-wrap">
              {blog.content}
            </div>
          </motion.div>
        </article>

        {/* Share Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-16 pt-8 border-t border-accent-teal/20"
        >
          <p className="text-text-muted text-center mb-4">Share this article</p>
          <div className="flex justify-center space-x-4">
            {['Facebook', 'Twitter', 'LinkedIn', 'WhatsApp'].map((platform) => (
              <button
                key={platform}
                className="px-6 py-2 bg-card rounded-lg text-text-muted hover:text-accent-yellow hover:bg-card/80 transition-colors text-sm"
              >
                {platform}
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default BlogDetail
