import axios from 'axios'

// Detect if we're in production (Vercel) or development (localhost)
const isProduction = typeof window !== 'undefined' && !window.location.hostname.includes('localhost')
const API_URL = isProduction ? '/api' : (import.meta.env.VITE_API_URL || 'http://localhost:5000/api')

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Extract nested data from responses
// Backend returns { data: ... } and axios wraps it in { data: { data: ... } }
api.interceptors.response.use((response) => {
  // If response.data has a 'data' property, return that structure
  // This allows destructuring like: const { data } = await api.get(...)
  // where data is the actual array/object from the backend
  if (response.data && typeof response.data === 'object' && 'data' in response.data) {
    return { ...response, data: response.data.data }
  }
  return response
})

// Collections
export const getCollections = () => api.get('/collections')
export const getCollection = (id) => api.get(`/collections/${id}`)
export const createCollection = (data) => api.post('/collections', data)
export const updateCollection = (id, data) => api.put(`/collections/${id}`, data)
export const deleteCollection = (id) => api.delete(`/collections/${id}`)

// Products
export const getProducts = (params) => api.get('/products', { params })
export const getProduct = (id) => api.get(`/products/${id}`)
export const getProductsByCollection = (collectionId) => api.get('/products', { params: { collection_id: collectionId } })
export const getFeaturedProducts = () => api.get('/products', { params: { featured: 'true' } })
export const createProduct = (data) => api.post('/products', data)
export const updateProduct = (id, data) => api.put(`/products/${id}`, data)
export const deleteProduct = (id) => api.delete(`/products/${id}`)

// Blogs
export const getBlogs = () => api.get('/blogs')
export const getBlog = (id) => api.get(`/blogs/${id}`)
export const createBlog = (data) => api.post('/blogs', data)
export const updateBlog = (id, data) => api.put(`/blogs/${id}`, data)
export const deleteBlog = (id) => api.delete(`/blogs/${id}`)

// Orders
export const getOrders = () => api.get('/orders')
export const getOrder = (id) => api.get(`/orders/${id}`)
export const getUserOrders = (userId) => api.get(`/orders/user/${userId}`)
export const createOrder = (data) => api.post('/orders', data)
export const updateOrderStatus = (id, status) => api.put(`/orders/${id}/status`, { status })
export const deleteOrder = (id) => api.delete(`/orders/${id}`)

// Wishlist
export const getWishlist = (userId) => api.get(`/wishlist/${userId}`)
export const addToWishlist = (userId, productId) => api.post('/wishlist', { user_id: userId, product_id: productId })
export const removeFromWishlist = (userId, productId) => api.delete(`/wishlist/${userId}/${productId}`)

// Contact
export const sendContactMessage = (data) => api.post('/contact', data)
export const getContactMessages = () => api.get('/contact')
export const deleteContactMessage = (id) => api.delete(`/contact/${id}`)

// Users (Admin)
export const getUsers = () => api.get('/users')
export const getUser = (id) => api.get(`/users/${id}`)
export const updateUser = (id, data) => api.put(`/users/${id}`, data)

// AI
export const generateImage = (prompt) => api.post('/ai/generate-image', { prompt })
export const chatWithAI = (message, history) => api.post('/ai/chat', { message, history })

// Reviews
export const getProductReviews = (productId) => api.get(`/reviews/product/${productId}`)
export const createReview = (data) => api.post('/reviews', data)
export const deleteReview = (id) => api.delete(`/reviews/${id}`)

export default api
