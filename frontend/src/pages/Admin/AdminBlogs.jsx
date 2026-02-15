import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit2, Trash2, X, Upload, Loader2, Eye, EyeOff } from 'lucide-react'
import { getBlogs, createBlog, updateBlog, deleteBlog } from '../../lib/api'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'

const AdminBlogs = () => {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingBlog, setEditingBlog] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    image_url: '',
    published: true
  })
  const [uploading, setUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchBlogs()
  }, [])

  const fetchBlogs = async () => {
    try {
      const { data } = await getBlogs()
      setBlogs(data || [])
    } catch (error) {
      console.error('Error fetching blogs:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Check file size (max 2MB for base64)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image must be less than 2MB')
      return
    }

    setUploading(true)
    try {
      // Convert to base64
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData({ ...formData, image_url: reader.result })
        toast.success('Image uploaded!')
        setUploading(false)
      }
      reader.onerror = () => {
        toast.error('Failed to read image')
        setUploading(false)
      }
      reader.readAsDataURL(file)
    } catch (error) {
      toast.error('Failed to upload image')
      setUploading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      if (editingBlog) {
        await updateBlog(editingBlog.id, formData)
        toast.success('Blog post updated!')
      } else {
        await createBlog(formData)
        toast.success('Blog post created!')
      }
      
      setModalOpen(false)
      setEditingBlog(null)
      setFormData({ title: '', content: '', excerpt: '', image_url: '', published: true })
      fetchBlogs()
    } catch (error) {
      toast.error('Failed to save blog post')
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (blog) => {
    setEditingBlog(blog)
    setFormData({
      title: blog.title,
      content: blog.content || '',
      excerpt: blog.excerpt || '',
      image_url: blog.image_url || '',
      published: blog.published !== false
    })
    setModalOpen(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return

    try {
      await deleteBlog(id)
      toast.success('Blog post deleted!')
      fetchBlogs()
    } catch (error) {
      toast.error('Failed to delete blog post')
    }
  }

  const togglePublish = async (blog) => {
    try {
      await updateBlog(blog.id, { ...blog, published: !blog.published })
      toast.success(blog.published ? 'Blog unpublished' : 'Blog published')
      fetchBlogs()
    } catch (error) {
      toast.error('Failed to update blog')
    }
  }

  const openNewModal = () => {
    setEditingBlog(null)
    setFormData({ title: '', content: '', excerpt: '', image_url: '', published: true })
    setModalOpen(true)
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-light font-['Playfair_Display']">
            Blog Posts
          </h1>
          <p className="text-text-muted mt-1">Manage your blog content</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={openNewModal}
          className="flex items-center space-x-2 bg-gradient-button text-white px-6 py-3 rounded-xl font-semibold"
        >
          <Plus size={20} />
          <span>New Post</span>
        </motion.button>
      </div>

      {/* Blog Posts List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 text-accent-yellow animate-spin" />
        </div>
      ) : blogs.length === 0 ? (
        <div className="text-center py-12 bg-card rounded-2xl">
          <p className="text-text-muted">No blog posts yet. Write your first one!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {blogs.map((blog) => (
            <motion.div
              key={blog.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card rounded-2xl p-5 flex items-center gap-5"
            >
              {/* Image */}
              <div className="w-24 h-24 rounded-xl overflow-hidden bg-primary-dark/50 flex-shrink-0">
                {blog.image_url ? (
                  <img
                    src={blog.image_url}
                    alt={blog.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-text-muted">
                    No image
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-text-light font-semibold text-lg truncate">
                    {blog.title}
                  </h3>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    blog.published
                      ? 'bg-green-400/20 text-green-400'
                      : 'bg-gray-400/20 text-gray-400'
                  }`}>
                    {blog.published ? 'Published' : 'Draft'}
                  </span>
                </div>
                <p className="text-text-muted text-sm line-clamp-2">
                  {blog.excerpt || blog.content?.substring(0, 150)}...
                </p>
                <p className="text-text-muted/70 text-xs mt-2">
                  {formatDate(blog.created_at)}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => togglePublish(blog)}
                  className="p-2 text-text-muted hover:text-accent-yellow transition-colors"
                  title={blog.published ? 'Unpublish' : 'Publish'}
                >
                  {blog.published ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
                <button
                  onClick={() => handleEdit(blog)}
                  className="p-2 text-text-muted hover:text-accent-yellow transition-colors"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={() => handleDelete(blog.id)}
                  className="p-2 text-text-muted hover:text-red-400 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card rounded-2xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-text-light">
                {editingBlog ? 'Edit Post' : 'New Post'}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="p-2 text-text-muted hover:text-text-light"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Featured Image */}
              <div>
                <label className="block text-text-light text-sm font-medium mb-2">
                  Featured Image (Optional)
                </label>
                <div className="relative">
                  {formData.image_url ? (
                    <div className="relative h-48 rounded-xl overflow-hidden">
                      <img
                        src={formData.image_url}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, image_url: '' })}
                        className="absolute top-2 right-2 p-1 bg-red-500 rounded-full text-white"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-accent-teal/30 rounded-xl cursor-pointer hover:border-accent-yellow/50 transition-colors">
                      {uploading ? (
                        <Loader2 className="w-8 h-8 text-accent-yellow animate-spin" />
                      ) : (
                        <>
                          <Upload className="w-8 h-8 text-text-muted mb-2" />
                          <span className="text-text-muted text-sm">Click to upload image</span>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-text-light text-sm font-medium mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  placeholder="Post title"
                  className="w-full px-4 py-3 bg-primary-dark/50 rounded-xl text-text-light placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-yellow/50"
                />
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-text-light text-sm font-medium mb-2">
                  Excerpt (Short summary)
                </label>
                <textarea
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  rows={2}
                  placeholder="Brief description for previews"
                  className="w-full px-4 py-3 bg-primary-dark/50 rounded-xl text-text-light placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-yellow/50 resize-none"
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-text-light text-sm font-medium mb-2">
                  Content
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  required
                  rows={10}
                  placeholder="Write your blog post content here..."
                  className="w-full px-4 py-3 bg-primary-dark/50 rounded-xl text-text-light placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-yellow/50 resize-none"
                />
              </div>

              {/* Published Toggle */}
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, published: !formData.published })}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    formData.published ? 'bg-accent-yellow' : 'bg-primary-dark/50'
                  }`}
                >
                  <span
                    className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                      formData.published ? 'left-7' : 'left-1'
                    }`}
                  />
                </button>
                <span className="text-text-light text-sm">
                  {formData.published ? 'Published' : 'Save as draft'}
                </span>
              </div>

              {/* Submit Button */}
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 py-3 bg-primary-dark/50 rounded-xl text-text-light font-semibold hover:bg-primary-dark transition-colors"
                >
                  Cancel
                </button>
                <motion.button
                  type="submit"
                  disabled={submitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 py-3 bg-gradient-button rounded-xl text-white font-semibold disabled:opacity-50"
                >
                  {submitting ? (
                    <Loader2 className="w-5 h-5 mx-auto animate-spin" />
                  ) : editingBlog ? (
                    'Update Post'
                  ) : (
                    'Publish Post'
                  )}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default AdminBlogs
