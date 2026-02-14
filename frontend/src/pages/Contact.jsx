import { useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Phone, Mail, Send, Loader2 } from 'lucide-react'
import { sendContactMessage } from '../lib/api'
import toast from 'react-hot-toast'

// Using slider image as hero from public folder
const heroImage = '/assets/slider/sliderimage3.jpeg'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await sendContactMessage(formData)
      toast.success('Message sent successfully! We\'ll get back to you soon.')
      setFormData({ name: '', email: '', phone: '', message: '' })
    } catch (error) {
      toast.error('Failed to send message. Please try again.')
      console.error('Contact form error:', error)
    } finally {
      setLoading(false)
    }
  }

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Our Location',
      details: ['123 Resin Street, Art District', 'Creative City, 12345'],
      color: 'text-blue-400'
    },
    {
      icon: Phone,
      title: 'Phone Number',
      details: ['+92 300 1234567', '+92 321 7654321'],
      color: 'text-green-400'
    },
    {
      icon: Mail,
      title: 'Email Address',
      details: ['hello@mahresinworld.com', 'support@mahresinworld.com'],
      color: 'text-accent-yellow'
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-64 md:h-80">
        <img
          src={heroImage}
          alt="Contact MahResin World"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary-dark/70 via-primary-dark/60 to-primary-dark flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center px-4"
          >
            <span className="text-accent-yellow text-sm tracking-[0.3em] uppercase">
              Get In Touch
            </span>
            <h1 className="text-5xl md:text-6xl font-bold mt-2 font-['Playfair_Display'] text-text-light">
              Contact Us
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            {contactInfo.map((info, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-card rounded-2xl p-6 text-center card-hover group"
              >
                <div className={`w-16 h-16 mx-auto mb-4 rounded-xl bg-primary-dark/50 flex items-center justify-center ${info.color} group-hover:scale-110 transition-transform`}>
                  <info.icon size={28} />
                </div>
                <h3 className="text-text-light font-semibold text-lg mb-2">{info.title}</h3>
                {info.details.map((detail, i) => (
                  <p key={i} className="text-text-muted text-sm">{detail}</p>
                ))}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="pb-24 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-card rounded-2xl p-8 md:p-12"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-text-light font-['Playfair_Display']">
                Send Us a Message
              </h2>
              <p className="text-text-muted mt-2">
                We'd love to hear from you. Fill out the form below and we'll get back to you as soon as possible.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-text-light text-sm font-medium mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="John Doe"
                    className="w-full px-4 py-3 bg-primary-dark/50 rounded-xl text-text-light placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-yellow/50"
                  />
                </div>
                <div>
                  <label className="block text-text-light text-sm font-medium mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="john@example.com"
                    className="w-full px-4 py-3 bg-primary-dark/50 rounded-xl text-text-light placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-yellow/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-text-light text-sm font-medium mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+92 300 1234567"
                  className="w-full px-4 py-3 bg-primary-dark/50 rounded-xl text-text-light placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-yellow/50"
                />
              </div>

              <div>
                <label className="block text-text-light text-sm font-medium mb-2">
                  Your Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  placeholder="Tell us how we can help you..."
                  className="w-full px-4 py-3 bg-primary-dark/50 rounded-xl text-text-light placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-yellow/50 resize-none"
                />
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-center space-x-2 bg-gradient-button text-white py-4 rounded-xl font-semibold btn-glow disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Send size={20} />
                    <span>Send Message</span>
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Contact
