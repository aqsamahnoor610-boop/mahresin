import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  Youtube,
  Mail,
  Phone,
  MapPin,
  Heart
} from 'lucide-react'

const Footer = () => {
  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'Collections', path: '/collections' },
    { name: 'Blog', path: '/blog' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ]

  const customerLinks = [
    { name: 'My Account', path: '/profile' },
    { name: 'My Orders', path: '/my-orders' },
    { name: 'Wishlist', path: '/wishlist' },
    { name: 'Cart', path: '/cart' },
  ]

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Youtube, href: '#', label: 'Youtube' },
  ]

  return (
    <footer className="bg-primary-deeper/50 border-t border-accent-teal/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-6">
            <Link to="/" className="inline-block">
              <h3 className="text-2xl font-bold">
                <span className="gradient-text font-['Playfair_Display']">MahResin</span>
                <span className="text-text-light font-light"> World</span>
              </h3>
            </Link>
            <p className="text-text-muted text-sm leading-relaxed">
              Discover the artistry of premium handmade resin creations. 
              Each piece is crafted with love and attention to detail, 
              bringing unique beauty to your space.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  whileHover={{ scale: 1.2, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 bg-card rounded-full flex items-center justify-center text-text-muted hover:text-accent-yellow hover:bg-card/80 transition-all duration-300"
                  aria-label={social.label}
                >
                  <social.icon size={18} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-text-light font-semibold text-lg mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className="text-text-muted hover:text-accent-yellow transition-colors duration-300 text-sm flex items-center space-x-2 group"
                  >
                    <span className="w-1.5 h-1.5 bg-accent-teal rounded-full group-hover:bg-accent-yellow transition-colors"></span>
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-text-light font-semibold text-lg mb-6">Customer Service</h4>
            <ul className="space-y-3">
              {customerLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className="text-text-muted hover:text-accent-yellow transition-colors duration-300 text-sm flex items-center space-x-2 group"
                  >
                    <span className="w-1.5 h-1.5 bg-accent-teal rounded-full group-hover:bg-accent-yellow transition-colors"></span>
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-text-light font-semibold text-lg mb-6">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <MapPin size={18} className="text-accent-yellow mt-0.5 flex-shrink-0" />
                <span className="text-text-muted text-sm">
                  123 Resin Street, Art District<br />
                  Creative City, 12345
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone size={18} className="text-accent-yellow flex-shrink-0" />
                <a 
                  href="tel:+1234567890" 
                  className="text-text-muted text-sm hover:text-accent-yellow transition-colors"
                >
                  +1 (234) 567-890
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Mail size={18} className="text-accent-yellow flex-shrink-0" />
                <a 
                  href="mailto:hello@mahresinworld.com" 
                  className="text-text-muted text-sm hover:text-accent-yellow transition-colors"
                >
                  hello@mahresinworld.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-accent-teal/20">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <p className="text-text-muted text-sm">
              © {new Date().getFullYear()} MahResin World. All rights reserved.
            </p>
            <p className="text-text-muted text-sm flex items-center">
              Made with <Heart size={14} className="text-red-400 mx-1" /> for resin art lovers
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
