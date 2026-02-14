import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, 
  ShoppingCart, 
  Heart, 
  Menu, 
  X, 
  User,
  LogOut,
  Package,
  ChevronDown
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import { useWishlist } from '../../context/WishlistContext'

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [profileDropdown, setProfileDropdown] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  
  const { user, signOut } = useAuth()
  const { cartCount } = useCart()
  const { wishlistItems } = useWishlist()
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/collections?search=${searchQuery}`)
      setSearchOpen(false)
      setSearchQuery('')
    }
  }

  const handleSignOut = async () => {
    await signOut()
    setProfileDropdown(false)
    navigate('/')
  }

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Collections', path: '/collections' },
    { name: 'Blog', path: '/blog' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ]

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-primary-dark/95 backdrop-blur-lg shadow-lg' 
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="text-2xl md:text-3xl font-bold"
              >
                <span className="gradient-text font-['Playfair_Display']">MahResin</span>
                <span className="text-text-light font-light"> World</span>
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="text-text-light hover:text-accent-yellow transition-colors duration-300 text-sm font-medium tracking-wide"
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Right Icons */}
            <div className="flex items-center space-x-4">
              {/* Search */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSearchOpen(true)}
                className="p-2 text-text-light hover:text-accent-yellow transition-colors"
              >
                <Search size={20} />
              </motion.button>

              {/* Wishlist */}
              <Link to="/wishlist">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 text-text-light hover:text-accent-yellow transition-colors relative"
                >
                  <Heart size={20} />
                  {wishlistItems.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-accent-yellow text-primary-dark text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                      {wishlistItems.length}
                    </span>
                  )}
                </motion.div>
              </Link>

              {/* Cart */}
              <Link to="/cart">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 text-text-light hover:text-accent-yellow transition-colors relative"
                >
                  <ShoppingCart size={20} />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-accent-yellow text-primary-dark text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                      {cartCount}
                    </span>
                  )}
                </motion.div>
              </Link>

              {/* Profile / Login */}
              {user ? (
                <div className="relative">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setProfileDropdown(!profileDropdown)}
                    className="flex items-center space-x-2 p-2 rounded-full bg-card hover:bg-card/80 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-button flex items-center justify-center">
                      <User size={16} className="text-white" />
                    </div>
                    <ChevronDown size={16} className="text-text-light hidden sm:block" />
                  </motion.button>

                  <AnimatePresence>
                    {profileDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-2 w-48 bg-card rounded-xl shadow-card overflow-hidden border border-accent-teal/20"
                      >
                        <div className="p-3 border-b border-accent-teal/20">
                          <p className="text-text-light text-sm font-medium truncate">
                            {user.email}
                          </p>
                        </div>
                        <Link
                          to="/my-orders"
                          onClick={() => setProfileDropdown(false)}
                          className="flex items-center space-x-3 px-4 py-3 hover:bg-primary-dark/50 transition-colors"
                        >
                          <Package size={18} className="text-accent-yellow" />
                          <span className="text-text-light text-sm">My Orders</span>
                        </Link>
                        <Link
                          to="/wishlist"
                          onClick={() => setProfileDropdown(false)}
                          className="flex items-center space-x-3 px-4 py-3 hover:bg-primary-dark/50 transition-colors"
                        >
                          <Heart size={18} className="text-accent-yellow" />
                          <span className="text-text-light text-sm">My Wishlist</span>
                        </Link>
                        <button
                          onClick={handleSignOut}
                          className="flex items-center space-x-3 px-4 py-3 hover:bg-primary-dark/50 transition-colors w-full"
                        >
                          <LogOut size={18} className="text-red-400" />
                          <span className="text-red-400 text-sm">Logout</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link to="/login">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-accent-yellow text-primary-dark px-6 py-2 rounded-full font-semibold text-sm btn-glow transition-all duration-300"
                  >
                    Login
                  </motion.button>
                </Link>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-text-light"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-primary-dark/95 backdrop-blur-lg border-t border-accent-teal/20"
            >
              <div className="px-4 py-6 space-y-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-3 text-text-light hover:text-accent-yellow transition-colors text-lg font-medium border-b border-accent-teal/10"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Search Modal */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-primary-dark/95 backdrop-blur-lg flex items-start justify-center pt-32"
            onClick={() => setSearchOpen(false)}
          >
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              className="w-full max-w-2xl px-4"
              onClick={(e) => e.stopPropagation()}
            >
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for products..."
                  className="w-full px-6 py-4 bg-card rounded-2xl text-text-light placeholder-text-muted text-lg focus:outline-none focus:ring-2 focus:ring-accent-yellow/50"
                  autoFocus
                />
                <button
                  type="submit"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-accent-yellow"
                >
                  <Search size={24} />
                </button>
              </form>
              <p className="text-center text-text-muted mt-4 text-sm">
                Press ESC or click outside to close
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Navbar
