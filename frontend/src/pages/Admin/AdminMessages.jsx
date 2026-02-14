import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, Loader2, Mail, Trash2, MessageSquare, Clock, CheckCircle } from 'lucide-react'
import { getContactMessages, deleteContactMessage } from '../../lib/api'
import toast from 'react-hot-toast'

const AdminMessages = () => {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedMessage, setSelectedMessage] = useState(null)

  useEffect(() => {
    fetchMessages()
  }, [])

  const fetchMessages = async () => {
    try {
      const { data } = await getContactMessages()
      setMessages(data || [])
    } catch (error) {
      console.error('Error fetching messages:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this message?')) return

    try {
      await deleteContactMessage(id)
      toast.success('Message deleted')
      fetchMessages()
      if (selectedMessage?.id === id) {
        setSelectedMessage(null)
      }
    } catch (error) {
      toast.error('Failed to delete message')
    }
  }

  const filteredMessages = messages.filter(msg => {
    const searchLower = searchQuery.toLowerCase()
    return (
      msg.name?.toLowerCase().includes(searchLower) ||
      msg.email?.toLowerCase().includes(searchLower) ||
      msg.subject?.toLowerCase().includes(searchLower) ||
      msg.message?.toLowerCase().includes(searchLower)
    )
  })

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-text-light font-['Playfair_Display']">
          Messages
        </h1>
        <p className="text-text-muted mt-1">View contact form submissions</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-card rounded-2xl p-5">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-accent-yellow/20 rounded-xl">
              <MessageSquare className="w-6 h-6 text-accent-yellow" />
            </div>
            <div>
              <p className="text-text-muted text-sm">Total Messages</p>
              <p className="text-2xl font-bold text-text-light">{messages.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-2xl p-5">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-400/20 rounded-xl">
              <Clock className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <p className="text-text-muted text-sm">This Week</p>
              <p className="text-2xl font-bold text-text-light">
                {messages.filter(m => {
                  const created = new Date(m.created_at)
                  const now = new Date()
                  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
                  return created >= weekAgo
                }).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search messages..."
          className="w-full pl-12 pr-4 py-3 bg-card rounded-xl text-text-light placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-yellow/50"
        />
      </div>

      {/* Messages List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 text-accent-yellow animate-spin" />
        </div>
      ) : filteredMessages.length === 0 ? (
        <div className="text-center py-12 bg-card rounded-2xl">
          <p className="text-text-muted">No messages found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredMessages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card rounded-2xl p-5 cursor-pointer hover:bg-card/80 transition-colors"
              onClick={() => setSelectedMessage(msg)}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-button flex items-center justify-center text-white font-bold flex-shrink-0">
                      {msg.name?.charAt(0)?.toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-text-light font-semibold truncate">{msg.name}</h3>
                      <p className="text-text-muted text-sm truncate">{msg.email}</p>
                    </div>
                  </div>
                  {msg.subject && (
                    <p className="text-text-light font-medium mb-1 truncate">{msg.subject}</p>
                  )}
                  <p className="text-text-muted text-sm line-clamp-2">{msg.message}</p>
                  <p className="text-text-muted/60 text-xs mt-2">{formatDate(msg.created_at)}</p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDelete(msg.id)
                  }}
                  className="p-2 text-text-muted hover:text-red-400 transition-colors flex-shrink-0"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Message Detail Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-text-light">Message Details</h2>
              <button
                onClick={() => setSelectedMessage(null)}
                className="text-text-muted hover:text-text-light"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {/* Sender Info */}
              <div className="flex items-center gap-4 p-4 bg-primary-dark/50 rounded-xl">
                <div className="w-14 h-14 rounded-full bg-gradient-button flex items-center justify-center text-white text-xl font-bold">
                  {selectedMessage.name?.charAt(0)?.toUpperCase()}
                </div>
                <div>
                  <h3 className="text-text-light font-semibold">{selectedMessage.name}</h3>
                  <p className="text-text-muted text-sm">{selectedMessage.email}</p>
                </div>
              </div>

              {/* Subject */}
              {selectedMessage.subject && (
                <div>
                  <p className="text-text-muted text-sm mb-1">Subject</p>
                  <p className="text-text-light font-medium">{selectedMessage.subject}</p>
                </div>
              )}

              {/* Message */}
              <div>
                <p className="text-text-muted text-sm mb-1">Message</p>
                <p className="text-text-light whitespace-pre-wrap bg-primary-dark/50 p-4 rounded-xl">
                  {selectedMessage.message}
                </p>
              </div>

              {/* Date */}
              <div className="flex items-center gap-2 text-text-muted/70 text-sm">
                <Clock size={14} />
                <span>{formatDate(selectedMessage.created_at)}</span>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <a
                  href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject || 'Your message'}`}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-button rounded-xl text-white font-semibold hover:opacity-90 transition-opacity"
                >
                  <Mail size={18} />
                  Reply via Email
                </a>
                <button
                  onClick={() => {
                    handleDelete(selectedMessage.id)
                  }}
                  className="px-6 py-3 bg-red-500/20 text-red-400 rounded-xl font-semibold hover:bg-red-500/30 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default AdminMessages
