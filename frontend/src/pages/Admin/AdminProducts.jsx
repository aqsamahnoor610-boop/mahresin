import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit2, Trash2, X, Upload, Loader2 } from 'lucide-react'
import { getProducts, getCollections, createProduct, updateProduct, deleteProduct } from '../../lib/api'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'

const AdminProducts = () => {
  const [products, setProducts] = useState([])
  const [collections, setCollections] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    stock: '',
    collection_id: '',
    images: [],
    featured: false
  })
  const [uploading, setUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [productsRes, collectionsRes] = await Promise.all([
        getProducts(),
        getCollections()
      ])
      setProducts(productsRes.data || [])
      setCollections(collectionsRes.data || [])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files)
    if (!files.length) return

    setUploading(true)
    try {
      const uploadedUrls = []

      for (const file of files) {
        const fileExt = file.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`
        const filePath = `products/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('images')
          .upload(filePath, file)

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
          .from('images')
          .getPublicUrl(filePath)

        uploadedUrls.push(publicUrl)
      }

      setFormData({ ...formData, images: [...formData.images, ...uploadedUrls] })
      toast.success('Images uploaded!')
    } catch (error) {
      toast.error('Failed to upload images')
      console.error('Upload error:', error)
    } finally {
      setUploading(false)
    }
  }

  const removeImage = (index) => {
    const newImages = formData.images.filter((_, i) => i !== index)
    setFormData({ ...formData, images: newImages })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock) || 0,
        collection_id: formData.collection_id || null,
        featured: formData.featured || false
      }

      if (editingProduct) {
        await updateProduct(editingProduct.id, productData)
        toast.success('Product updated!')
      } else {
        await createProduct(productData)
        toast.success('Product created!')
      }
      
      setModalOpen(false)
      setEditingProduct(null)
      setFormData({ title: '', description: '', price: '', stock: '', collection_id: '', images: [] })
      fetchData()
    } catch (error) {
      toast.error('Failed to save product')
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (product) => {
    setEditingProduct(product)
    setFormData({
      title: product.title,
      description: product.description || '',
      price: product.price?.toString() || '',
      stock: product.stock?.toString() || '',
      collection_id: product.collection_id || '',
      images: product.images || [],
      featured: product.featured || false
    })
    setModalOpen(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return

    try {
      await deleteProduct(id)
      toast.success('Product deleted!')
      fetchData()
    } catch (error) {
      toast.error('Failed to delete product')
    }
  }

  const openNewModal = () => {
    setEditingProduct(null)
    setFormData({ title: '', description: '', price: '', stock: '', collection_id: '', images: [], featured: false })
    setModalOpen(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-light font-['Playfair_Display']">
            Products
          </h1>
          <p className="text-text-muted mt-1">Manage your products inventory</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={openNewModal}
          className="flex items-center space-x-2 bg-gradient-button text-white px-6 py-3 rounded-xl font-semibold"
        >
          <Plus size={20} />
          <span>Add Product</span>
        </motion.button>
      </div>

      {/* Products Table */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 text-accent-yellow animate-spin" />
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12 bg-card rounded-2xl">
          <p className="text-text-muted">No products yet. Create your first one!</p>
        </div>
      ) : (
        <div className="bg-card rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-accent-teal/20">
                  <th className="text-left py-4 px-6 text-text-muted text-sm font-medium">Product</th>
                  <th className="text-left py-4 px-6 text-text-muted text-sm font-medium">Collection</th>
                  <th className="text-left py-4 px-6 text-text-muted text-sm font-medium">Price</th>
                  <th className="text-left py-4 px-6 text-text-muted text-sm font-medium">Stock</th>
                  <th className="text-right py-4 px-6 text-text-muted text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b border-accent-teal/10 hover:bg-primary-dark/30">
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-primary-dark/50">
                          <img
                            src={product.images?.[0] || '/placeholder.jpg'}
                            alt={product.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <p className="text-text-light font-medium">{product.title}</p>
                            {product.featured && (
                              <span className="px-2 py-0.5 bg-accent-yellow/20 text-accent-yellow text-xs font-semibold rounded-full">
                                ⭐ Featured
                              </span>
                            )}
                          </div>
                          <p className="text-text-muted text-sm line-clamp-1">
                            {product.description?.substring(0, 50)}...
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-text-muted">
                      {collections.find(c => c.id === product.collection_id)?.title || '-'}
                    </td>
                    <td className="py-4 px-6 text-accent-yellow font-semibold">
                      Rs. {product.price?.toLocaleString()}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        product.stock > 10
                          ? 'bg-green-400/20 text-green-400'
                          : product.stock > 0
                          ? 'bg-yellow-400/20 text-yellow-400'
                          : 'bg-red-400/20 text-red-400'
                      }`}>
                        {product.stock || 0} in stock
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="p-2 text-text-muted hover:text-accent-yellow transition-colors"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-2 text-text-muted hover:text-red-400 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-text-light">
                {editingProduct ? 'Edit Product' : 'New Product'}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="p-2 text-text-muted hover:text-text-light"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Images Upload */}
              <div>
                <label className="block text-text-light text-sm font-medium mb-2">
                  Product Images
                </label>
                <div className="grid grid-cols-4 gap-3">
                  {formData.images.map((url, index) => (
                    <div key={index} className="relative h-24 rounded-xl overflow-hidden">
                      <img src={url} alt={`Product ${index + 1}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 p-1 bg-red-500 rounded-full text-white"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                  <label className="flex flex-col items-center justify-center h-24 border-2 border-dashed border-accent-teal/30 rounded-xl cursor-pointer hover:border-accent-yellow/50 transition-colors">
                    {uploading ? (
                      <Loader2 className="w-6 h-6 text-accent-yellow animate-spin" />
                    ) : (
                      <>
                        <Upload className="w-6 h-6 text-text-muted" />
                        <span className="text-text-muted text-xs mt-1">Add</span>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-5">
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
                    placeholder="Product name"
                    className="w-full px-4 py-3 bg-primary-dark/50 rounded-xl text-text-light placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-yellow/50"
                  />
                </div>

                {/* Collection */}
                <div>
                  <label className="block text-text-light text-sm font-medium mb-2">
                    Collection
                  </label>
                  <select
                    value={formData.collection_id}
                    onChange={(e) => setFormData({ ...formData, collection_id: e.target.value })}
                    className="w-full px-4 py-3 bg-primary-dark/50 rounded-xl text-text-light focus:outline-none focus:ring-2 focus:ring-accent-yellow/50"
                  >
                    <option value="">Select collection</option>
                    {collections.map((collection) => (
                      <option key={collection.id} value={collection.id}>
                        {collection.title}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price */}
                <div>
                  <label className="block text-text-light text-sm font-medium mb-2">
                    Price (Rs.)
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    className="w-full px-4 py-3 bg-primary-dark/50 rounded-xl text-text-light placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-yellow/50"
                  />
                </div>

                {/* Stock */}
                <div>
                  <label className="block text-text-light text-sm font-medium mb-2">
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    min="0"
                    placeholder="0"
                    className="w-full px-4 py-3 bg-primary-dark/50 rounded-xl text-text-light placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-yellow/50"
                  />
                </div>
              </div>

              {/* Featured Checkbox */}
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-5 h-5 rounded border-2 border-accent-teal/30 bg-primary-dark/50 text-accent-yellow focus:ring-accent-yellow/50 focus:ring-2 cursor-pointer"
                />
                <label htmlFor="featured" className="text-text-light text-sm font-medium cursor-pointer">
                  ⭐ Featured Product (Show on Homepage)
                </label>
              </div>

              {/* Description */}
              <div>
                <label className="block text-text-light text-sm font-medium mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  placeholder="Product description"
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
                  ) : editingProduct ? (
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

export default AdminProducts
