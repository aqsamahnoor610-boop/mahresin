require('dotenv').config()
const express = require('express')
const cors = require('cors')
const { createClient } = require('@supabase/supabase-js')

const app = express()
const PORT = process.env.PORT || 5000

// Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// Middleware
app.use(cors())
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ limit: '10mb', extended: true }))

// Routes
const collectionsRoutes = require('./routes/collections')
const productsRoutes = require('./routes/products')
const blogsRoutes = require('./routes/blogs')
const ordersRoutes = require('./routes/orders')
const wishlistRoutes = require('./routes/wishlist')
const contactRoutes = require('./routes/contact')
const usersRoutes = require('./routes/users')
const reviewsRoutes = require('./routes/reviews')
const aiRoutes = require('./routes/ai')

// Use routes
app.use('/api/collections', collectionsRoutes)
app.use('/api/products', productsRoutes)
app.use('/api/blogs', blogsRoutes)
app.use('/api/orders', ordersRoutes)
app.use('/api/wishlist', wishlistRoutes)
app.use('/api/contact', contactRoutes)
app.use('/api/users', usersRoutes)
app.use('/api/reviews', reviewsRoutes)
app.use('/api/ai', aiRoutes)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'MahResin World API is running' })
})

// Root route - welcome page
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>MahResin World API</title>
        <style>
          body { font-family: Arial, sans-serif; background: #0F4A3A; color: #F0FDF4; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
          .container { text-align: center; }
          h1 { color: #F4B400; }
          p { color: #86EFAC; }
          a { color: #2DD4BF; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>🎨 MahResin World API</h1>
          <p>Backend server is running on port ${PORT}</p>
          <p>API Endpoints available at <a href="/api/health">/api/health</a></p>
          <p>Frontend: <a href="http://localhost:3000">http://localhost:3000</a></p>
        </div>
      </body>
    </html>
  `)
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Something went wrong!' })
})

// For local development
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 MahResin World Backend running on port ${PORT}`)
  })
}

// Export for Vercel
module.exports = app
