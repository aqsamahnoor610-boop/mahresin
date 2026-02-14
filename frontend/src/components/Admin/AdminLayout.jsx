import { useState } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  LayoutDashboard, 
  FolderOpen, 
  Package, 
  FileText, 
  ShoppingCart, 
  Users,
  MessageSquare,
  LogOut,
  Menu,
  X,
  ChevronRight
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { signOut } = useAuth()

  const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Collections', path: '/admin/collections', icon: FolderOpen },
    { name: 'Products', path: '/admin/products', icon: Package },
    { name: 'Blog Posts', path: '/admin/blogs', icon: FileText },
    { name: 'Orders', path: '/admin/orders', icon: ShoppingCart },
    { name: 'Users', path: '/admin/users', icon: Users },
    { name: 'Messages', path: '/admin/messages', icon: MessageSquare },
  ]

  const handleSignOut = async () => {
    // Clear admin localStorage session
    localStorage.removeItem('mahresin_admin')
    await signOut()
    window.location.href = '/admin/login'
  }

  const isActive = (path) => {
    if (path === '/admin') {
      return location.pathname === '/admin'
    }
    return location.pathname.startsWith(path)
  }

  return (
    <div className="min-h-screen bg-gradient-main">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-card z-50 transform transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-accent-teal/20">
            <Link to="/admin" className="flex items-center space-x-2">
              <div className="text-xl font-bold">
                <span className="gradient-text font-['Playfair_Display']">MahResin</span>
                <span className="text-text-light font-light text-sm"> Admin</span>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                  isActive(item.path)
                    ? 'bg-gradient-button text-white'
                    : 'text-text-muted hover:bg-primary-dark/50 hover:text-text-light'
                }`}
              >
                <item.icon size={20} />
                <span className="font-medium">{item.name}</span>
                {isActive(item.path) && (
                  <ChevronRight size={16} className="ml-auto" />
                )}
              </Link>
            ))}
          </nav>

          {/* Bottom Actions */}
          <div className="p-4 border-t border-accent-teal/20">
            <Link
              to="/"
              className="flex items-center space-x-3 px-4 py-3 rounded-xl text-text-muted hover:bg-primary-dark/50 hover:text-text-light transition-all mb-2"
            >
              <span>← Back to Website</span>
            </Link>
            <button
              onClick={handleSignOut}
              className="flex items-center space-x-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/20 transition-all w-full"
            >
              <LogOut size={20} />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-primary-dark/80 backdrop-blur-lg border-b border-accent-teal/20 px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-text-light"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-xl font-semibold text-text-light">
              Admin Panel
            </h1>
            <div className="flex items-center space-x-4">
              <span className="text-text-muted text-sm hidden sm:block">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
