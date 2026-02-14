import { useState, useRef, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import { Sparkles, MessageCircle, Send, Loader2, RefreshCw, Trash2, ShoppingBag } from 'lucide-react'
import { generateImage, chatWithAI, sendContactMessage } from '../../lib/api'
import toast from 'react-hot-toast'

const AISection = () => {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" })

  return (
    <section ref={sectionRef} className="py-24 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-accent-yellow text-sm tracking-[0.3em] uppercase">
            Powered by AI
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mt-2 font-['Playfair_Display'] text-text-light">
            AI-Powered <span className="gradient-text">Experience</span>
          </h2>
          <p className="text-text-muted mt-4 max-w-2xl mx-auto">
            Explore our cutting-edge AI tools to generate unique resin art concepts 
            or chat with our intelligent assistant for personalized recommendations.
          </p>
        </motion.div>

        {/* AI Cards Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* AI Image Generator */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <AIImageGenerator />
          </motion.div>

          {/* AI Chat Assistant */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <AIChatAssistant />
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// AI Image Generator Component
const AIImageGenerator = () => {
  const [prompt, setPrompt] = useState('')
  const [generatedImage, setGeneratedImage] = useState(null)
  const [loading, setLoading] = useState(false)
  const [imageLoading, setImageLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showQuoteForm, setShowQuoteForm] = useState(false)
  const [quoteForm, setQuoteForm] = useState({ name: '', email: '', phone: '', message: '' })
  const [sendingQuote, setSendingQuote] = useState(false)

  const handleGenerate = async () => {
    if (!prompt.trim()) return

    setLoading(true)
    setImageLoading(true)
    setError(null)
    setShowQuoteForm(false)
    setGeneratedImage(null)
    setRetryCount(0)

    console.log('Generating AI image for prompt:', prompt)
    
    try {
      // Use backend API which fetches and returns base64 image
      const response = await fetch('http://localhost:5000/api/ai/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      })

      const data = await response.json()
      console.log('Backend response received')
      
      if (response.ok && data.imageUrl) {
        setGeneratedImage(data.imageUrl)
        setImageLoading(false)
      } else {
        throw new Error(data.error || 'Failed to generate')
      }
    } catch (err) {
      console.error('Generation error:', err)
      setError('Image generation failed. Please try again.')
      setImageLoading(false)
    }
    
    setLoading(false)
  }

  const [retryCount, setRetryCount] = useState(0)

  const handleImageLoad = () => {
    console.log('Image loaded successfully')
    setImageLoading(false)
    setRetryCount(0)
    setError(null)
  }

  const handleImageError = () => {
    console.log('Image display error')
    setImageLoading(false)
    setError('Image failed to display. Please try again.')
  }

  const handleRequestQuote = async (e) => {
    e.preventDefault()
    if (!quoteForm.name || !quoteForm.email) {
      toast.error('Please fill in your name and email')
      return
    }

    setSendingQuote(true)
    try {
      await sendContactMessage({
        name: quoteForm.name,
        email: quoteForm.email,
        phone: quoteForm.phone || 'Not provided',
        subject: 'AI Generated Design - Price Quote Request',
        message: `Price quote request for AI generated design:\n\nDesign Description: ${prompt}\n\nGenerated Image URL: ${generatedImage}\n\nAdditional Notes: ${quoteForm.message || 'None'}`
      })
      
      toast.success('Quote request sent! We\'ll contact you soon.')
      setShowQuoteForm(false)
      setQuoteForm({ name: '', email: '', phone: '', message: '' })
    } catch (err) {
      console.error('Quote request error:', err)
      toast.error('Failed to send request. Please try again.')
    } finally {
      setSendingQuote(false)
    }
  }

  const examplePrompts = [
    "Ocean wave resin coaster with gold flakes",
    "Galaxy themed jewelry with purple swirls",
    "Flower preserved in crystal clear resin",
  ]

  return (
    <div className="bg-card rounded-2xl p-6 md:p-8 h-full glow-border">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-12 h-12 bg-gradient-button rounded-xl flex items-center justify-center">
          <Sparkles className="text-white" size={24} />
        </div>
        <div>
          <h3 className="text-text-light font-bold text-xl">AI Image Generator</h3>
          <p className="text-text-muted text-sm">Create unique resin art concepts</p>
        </div>
      </div>

      {/* Generated Image Display */}
      <div className="relative mb-4 h-48 md:h-56 bg-primary-dark/50 rounded-xl overflow-hidden flex items-center justify-center">
        {loading ? (
          <div className="flex flex-col items-center space-y-3">
            <Loader2 className="w-10 h-10 text-accent-yellow animate-spin" />
            <p className="text-text-muted text-sm">Preparing generation...</p>
          </div>
        ) : generatedImage ? (
          <>
            {imageLoading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-primary-dark/80 z-10">
                <Loader2 className="w-10 h-10 text-accent-yellow animate-spin" />
                <p className="text-text-muted text-sm mt-3">AI is creating your artwork...</p>
                <p className="text-text-muted text-xs mt-1">(This may take 30-60 seconds)</p>
              </div>
            )}
            <img
              src={generatedImage}
              alt="Generated resin art"
              className="w-full h-full object-cover"
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
          </>
        ) : (
          <div className="text-center p-4">
            <Sparkles className="w-12 h-12 text-accent-yellow/30 mx-auto mb-3" />
            <p className="text-text-muted text-sm">
              Enter a prompt below to generate AI artwork
            </p>
          </div>
        )}

        {error && !imageLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-primary-dark/80">
            <p className="text-amber-400 text-sm text-center px-4">{error}</p>
          </div>
        )}
      </div>

      {/* Request Price Quote Button - Show when we have a prompt, even if image failed */}
      {prompt && !imageLoading && !showQuoteForm && (
        <button
          onClick={() => setShowQuoteForm(true)}
          className="w-full mb-4 py-3 bg-gradient-button rounded-xl text-white font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity btn-glow"
        >
          <ShoppingBag size={18} />
          Request Price Quote for This Design
        </button>
      )}

      {/* Quote Request Form */}
      {showQuoteForm && (
        <form onSubmit={handleRequestQuote} className="mb-4 p-4 bg-primary-dark/30 rounded-xl space-y-3">
          <h4 className="text-text-light font-semibold text-sm">Request a Price Quote</h4>
          <input
            type="text"
            placeholder="Your Name *"
            value={quoteForm.name}
            onChange={(e) => setQuoteForm({ ...quoteForm, name: e.target.value })}
            className="w-full px-3 py-2 bg-primary-dark/50 rounded-lg text-text-light placeholder-text-muted text-sm focus:outline-none focus:ring-2 focus:ring-accent-yellow/50"
            required
          />
          <input
            type="email"
            placeholder="Your Email *"
            value={quoteForm.email}
            onChange={(e) => setQuoteForm({ ...quoteForm, email: e.target.value })}
            className="w-full px-3 py-2 bg-primary-dark/50 rounded-lg text-text-light placeholder-text-muted text-sm focus:outline-none focus:ring-2 focus:ring-accent-yellow/50"
            required
          />
          <input
            type="tel"
            placeholder="Phone Number (optional)"
            value={quoteForm.phone}
            onChange={(e) => setQuoteForm({ ...quoteForm, phone: e.target.value })}
            className="w-full px-3 py-2 bg-primary-dark/50 rounded-lg text-text-light placeholder-text-muted text-sm focus:outline-none focus:ring-2 focus:ring-accent-yellow/50"
          />
          <textarea
            placeholder="Additional notes (size, quantity, etc.)"
            value={quoteForm.message}
            onChange={(e) => setQuoteForm({ ...quoteForm, message: e.target.value })}
            rows={2}
            className="w-full px-3 py-2 bg-primary-dark/50 rounded-lg text-text-light placeholder-text-muted text-sm focus:outline-none focus:ring-2 focus:ring-accent-yellow/50 resize-none"
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setShowQuoteForm(false)}
              className="flex-1 py-2 bg-primary-dark/50 rounded-lg text-text-muted text-sm hover:bg-primary-dark transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={sendingQuote}
              className="flex-1 py-2 bg-accent-yellow rounded-lg text-primary-dark font-semibold text-sm hover:bg-accent-gold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {sendingQuote ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send size={14} />}
              Send Request
            </button>
          </div>
        </form>
      )}

      {/* Prompt Input */}
      <div className="space-y-4">
        <div className="relative">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleGenerate()}
            placeholder="Describe your dream resin art..."
            className="w-full px-4 py-3 bg-primary-dark/50 rounded-xl text-text-light placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-yellow/50 pr-12"
          />
          <button
            onClick={handleGenerate}
            disabled={loading || !prompt.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-accent-yellow rounded-lg flex items-center justify-center text-primary-dark disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent-gold transition-colors"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles size={16} />
            )}
          </button>
        </div>

        {/* Example Prompts */}
        <div className="space-y-2">
          <p className="text-text-muted text-xs">Try these prompts:</p>
          <div className="flex flex-wrap gap-2">
            {examplePrompts.map((example, index) => (
              <button
                key={index}
                onClick={() => setPrompt(example)}
                className="text-xs px-3 py-1.5 bg-primary-dark/50 rounded-full text-text-muted hover:text-accent-yellow hover:bg-primary-dark transition-colors"
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// AI Chat Assistant Component
const AIChatAssistant = () => {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const chatContainerRef = useRef(null)

  // Load chat history from localStorage
  useEffect(() => {
    const savedMessages = localStorage.getItem('mahresin_chat_history')
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages))
    } else {
      // Welcome message
      setMessages([
        {
          role: 'assistant',
          content: "Hello! 👋 I'm your MahResin World assistant. I can help you find the perfect resin art piece, answer questions about our products, or assist with your order. How can I help you today?"
        }
      ])
    }
  }, [])

  // Save chat history to localStorage
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('mahresin_chat_history', JSON.stringify(messages))
    }
  }, [messages])

  // Scroll to bottom within chat container only (not the page)
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || loading) return

    const userMessage = { role: 'user', content: input }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const response = await chatWithAI(input, messages)
      // Handle response - check nested data structure
      const aiResponse = response?.data?.data?.response || response?.data?.response
      if (aiResponse) {
        setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }])
      } else {
        throw new Error('Empty response')
      }
    } catch (err) {
      console.error('Chat error:', err)
      // Fallback responses for when API is not available
      const fallbackResponses = [
        "I'd be happy to help you find the perfect resin art piece! We have coasters, jewelry, home décor, and custom pieces. What are you looking for?",
        "Great question! Our resin art is handcrafted with premium materials. Each piece is unique and made with love. Would you like to browse our collections?",
        "Thank you for your interest! You can reach our team through the Contact page or browse our collections to see our latest creations."
      ]
      const randomResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)]
      setMessages(prev => [...prev, { role: 'assistant', content: randomResponse }])
    } finally {
      setLoading(false)
    }
  }

  const clearHistory = () => {
    setMessages([
      {
        role: 'assistant',
        content: "Chat history cleared! How can I assist you today?"
      }
    ])
    localStorage.removeItem('mahresin_chat_history')
  }

  return (
    <div className="bg-card rounded-2xl p-6 md:p-8 h-full glow-border flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-button rounded-xl flex items-center justify-center">
            <MessageCircle className="text-white" size={24} />
          </div>
          <div>
            <h3 className="text-text-light font-bold text-xl">AI Chat Assistant</h3>
            <p className="text-text-muted text-sm">Get personalized help</p>
          </div>
        </div>
        <button
          onClick={clearHistory}
          className="p-2 text-text-muted hover:text-red-400 transition-colors"
          title="Clear chat history"
        >
          <Trash2 size={18} />
        </button>
      </div>

      {/* Messages Container */}
      <div ref={chatContainerRef} className="flex-1 overflow-y-auto space-y-4 mb-4 max-h-64 md:max-h-72 pr-2">
        {messages.map((msg, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm ${
                msg.role === 'user'
                  ? 'bg-accent-yellow text-primary-dark rounded-br-sm'
                  : 'bg-primary-dark/50 text-text-light rounded-bl-sm'
              }`}
            >
              {msg.content}
            </div>
          </motion.div>
        ))}
        
        {loading && (
          <div className="flex justify-start">
            <div className="bg-primary-dark/50 px-4 py-3 rounded-2xl rounded-bl-sm">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-accent-yellow rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-accent-yellow rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-accent-yellow rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="relative">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type your message..."
          className="w-full px-4 py-3 bg-primary-dark/50 rounded-xl text-text-light placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-yellow/50 pr-12"
        />
        <button
          onClick={handleSend}
          disabled={loading || !input.trim()}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-accent-yellow rounded-lg flex items-center justify-center text-primary-dark disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent-gold transition-colors"
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  )
}

export default AISection
