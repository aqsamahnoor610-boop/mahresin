import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit2, Trash2, X, Upload, Loader2 } from 'lucide-react'
import { getCollections, createCollection, updateCollection, deleteCollection } from '../../lib/api'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'

const AdminCollections = () => {
  const [collections, setCollections] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingCollection, setEditingCollection] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: ''
  })
  const [uploading, setUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchCollections()
  }, [])

  const fetchCollections = async () => {
    try {
      const { data } = await getCollections()
      setCollections(data || [])
    } catch (error) {
      console.error('Error fetching collections:', error)
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
      console.error('Upload error:', error)
      setUploading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      if (editingCollection) {
        await updateCollection(editingCollection.id, formData)
        toast.success('Collection updated!')
      } else {
        await createCollection(formData)
        toast.success('Collection created!')
      }
      
      setModalOpen(false)
      setEditingCollection(null)
      setFormData({ title: '', description: '', image_url: '' })
      fetchCollections()
    } catch (error) {
      toast.error('Failed to save collection')
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (collection) => {
    setEditingCollection(collection)
    setFormData({
      title: collection.title,
      description: collection.description || '',
      image_url: collection.image_url || ''
    })
    setModalOpen(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this collection?')) return

    try {
      await deleteCollection(id)
      toast.success('Collection deleted!')
      fetchCollections()
    } catch (error) {
      toast.error('Failed to delete collection')
    }
  }

  const openNewModal = () => {
    setEditingCollection(null)
    setFormData({ title: '', description: '', image_url: '' })
    setModalOpen(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-light font-['Playfair_Display']">
            Collections
          </h1>
          <p className="text-text-muted mt-1">Manage your product collections</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={openNewModal}
          className="flex items-center space-x-2 bg-gradient-button text-white px-6 py-3 rounded-xl font-semibold"
        >
          <Plus size={20} />
          <span>Add Collection</span>
        </motion.button>
      </div>

      {/* Collections Grid */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 text-accent-yellow animate-spin" />
        </div>
      ) : collections.length === 0 ? (
        <div className="text-center py-12 bg-card rounded-2xl">
          <p className="text-text-muted">No collections yet. Create your first one!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.map((collection) => (
            <motion.div
              key={collection.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card rounded-2xl overflow-hidden group"
            >
              <div className="relative h-48">
                <img
                  src={collection.image_url || '/placeholder.jpg'}
                  alt={collection.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-4">
                  <button
                    onClick={() => handleEdit(collection)}
                    className="p-3 bg-white rounded-full text-primary-dark hover:bg-accent-yellow transition-colors"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(collection.id)}
                    className="p-3 bg-white rounded-full text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-text-light font-semibold text-lg">{collection.title}</h3>
                <p className="text-text-muted text-sm mt-1 line-clamp-2">
                  {collection.description || 'No description'}
                </p>
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
            className="bg-card rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-text-light">
                {editingCollection ? 'Edit Collection' : 'New Collection'}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="p-2 text-text-muted hover:text-text-light"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Image Upload */}
              <div>
                <label className="block text-text-light text-sm font-medium mb-2">
                  Collection Image
                </label>
                <div className="relative">
                  {formData.image_url ? (
                    <div className="relative h-40 rounded-xl overflow-hidden">
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
                    <label className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-accent-teal/30 rounded-xl cursor-pointer hover:border-accent-yellow/50 transition-colors">
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
                  placeholder="Collection name"
                  className="w-full px-4 py-3 bg-primary-dark/50 rounded-xl text-text-light placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-yellow/50"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-text-light text-sm font-medium mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  placeholder="Brief description of this collection"
                  className="w-full px-4 py-3 bg-primary-dark/50 rounded-xl text-text-light placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-yellow/50 resize-none"
                />
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
                  ) : editingCollection ? (
                    'Update'
                  ) : (
                    'Create'
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

export default AdminCollections
