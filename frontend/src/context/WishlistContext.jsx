import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'
import { getWishlist, addToWishlist as apiAddToWishlist, removeFromWishlist as apiRemoveFromWishlist } from '../lib/api'
import toast from 'react-hot-toast'

const WishlistContext = createContext({})

export const useWishlist = () => useContext(WishlistContext)

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth()
  const [wishlistItems, setWishlistItems] = useState([])
  const [loading, setLoading] = useState(false)

  // Fetch wishlist when user logs in
  useEffect(() => {
    if (user) {
      fetchWishlist()
    } else {
      setWishlistItems([])
    }
  }, [user])

  const fetchWishlist = async () => {
    if (!user) return
    
    setLoading(true)
    try {
      const { data } = await getWishlist(user.id)
      setWishlistItems(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error fetching wishlist:', error)
    } finally {
      setLoading(false)
    }
  }

  const addToWishlist = async (productId) => {
    if (!user) {
      toast.error('Please login to add items to wishlist')
      return false
    }

    try {
      await apiAddToWishlist(user.id, productId)
      await fetchWishlist()
      toast.success('Added to wishlist')
      return true
    } catch (error) {
      console.error('Error adding to wishlist:', error)
      toast.error('Failed to add to wishlist')
      return false
    }
  }

  const removeFromWishlist = async (productId) => {
    if (!user) return false

    try {
      await apiRemoveFromWishlist(user.id, productId)
      setWishlistItems(prev => prev.filter(item => item.product_id !== productId))
      toast.success('Removed from wishlist')
      return true
    } catch (error) {
      console.error('Error removing from wishlist:', error)
      toast.error('Failed to remove from wishlist')
      return false
    }
  }

  const isInWishlist = (productId) => {
    return wishlistItems.some(item => item.product_id === productId)
  }

  const value = {
    wishlistItems,
    loading,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    refreshWishlist: fetchWishlist
  }

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  )
}
