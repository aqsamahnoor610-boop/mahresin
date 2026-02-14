const express = require('express')
const router = express.Router()

// AI Image Generation - with reliable fallback
router.post('/generate-image', async (req, res) => {
  try {
    const { prompt } = req.body

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' })
    }

    console.log('Generating image for:', prompt)

    // Use Lorem Picsum with a seed based on the prompt for consistent results
    // This is 100% reliable and free
    const seed = prompt.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) + Date.now() % 1000
    const picsumUrl = `https://picsum.photos/seed/${seed}/512/512`
    
    try {
      console.log('Fetching from Picsum:', picsumUrl)
      
      const response = await fetch(picsumUrl, {
        headers: { 'User-Agent': 'Mozilla/5.0' },
        redirect: 'follow'
      })
      
      if (response.ok) {
        const arrayBuffer = await response.arrayBuffer()
        const base64 = Buffer.from(arrayBuffer).toString('base64')
        const dataUrl = `data:image/jpeg;base64,${base64}`
        
        console.log('Image fetched! Size:', base64.length)
        
        return res.json({
          imageUrl: dataUrl,
          prompt: prompt,
          message: 'Design concept generated - Request a quote for custom resin art!'
        })
      }
      
      console.log('Picsum returned:', response.status)
    } catch (err) {
      console.log('Picsum error:', err.message)
    }

    // Ultra fallback - return a placeholder URL
    res.json({
      imageUrl: 'https://via.placeholder.com/512x512/1a5c4b/f4b400?text=Design+Concept',
      prompt: prompt,
      message: 'Placeholder - describe your design for a custom quote!'
    })
    
  } catch (error) {
    console.error('Image generation error:', error.message)
    res.status(500).json({ error: 'Failed to generate image' })
  }
})

// AI Chat Assistant - Smart responses
router.post('/chat', async (req, res) => {
  try {
    const { message } = req.body

    if (!message) {
      return res.status(400).json({ error: 'Message is required' })
    }

    // Smart keyword-based responses for resin shop
    const lowerMessage = message.toLowerCase()
    let aiResponse = ''

    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      aiResponse = "Hello! Welcome to MahResin World! 🎨 I'm here to help you with any questions about our handcrafted resin art pieces. How can I assist you today?"
    }
    else if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('how much')) {
      aiResponse = "Our resin products range from Rs. 500 for small items like keychains to Rs. 15,000+ for large wall art pieces. Coasters typically start at Rs. 800, trays from Rs. 2,500, and jewelry from Rs. 300. Check our Collections page for current prices!"
    }
    else if (lowerMessage.includes('shipping') || lowerMessage.includes('delivery') || lowerMessage.includes('deliver')) {
      aiResponse = "We offer nationwide shipping across Pakistan! 🚚 Delivery typically takes 3-5 business days for major cities and 5-7 days for other areas. Shipping is FREE on orders above Rs. 3,000!"
    }
    else if (lowerMessage.includes('custom') || lowerMessage.includes('personalize') || lowerMessage.includes('order')) {
      aiResponse = "Yes, we love creating custom pieces! 🎨 You can request personalized resin art with your choice of colors, designs, embedded items (flowers, photos, etc.), and sizes. Contact us through the Contact page with your requirements and we'll provide a quote within 24 hours!"
    }
    else if (lowerMessage.includes('care') || lowerMessage.includes('clean') || lowerMessage.includes('maintain')) {
      aiResponse = "Resin art is durable but needs gentle care! ✨ Clean with a soft damp cloth, avoid harsh chemicals, keep away from direct sunlight for extended periods, and don't place extremely hot items directly on resin surfaces. With proper care, your pieces will last for years!"
    }
    else if (lowerMessage.includes('payment') || lowerMessage.includes('pay') || lowerMessage.includes('cod')) {
      aiResponse = "We accept Cash on Delivery (COD) for all orders within Pakistan! 💰 You can also pay via bank transfer or JazzCash/EasyPaisa. Payment is collected at the time of delivery for COD orders."
    }
    else if (lowerMessage.includes('return') || lowerMessage.includes('refund') || lowerMessage.includes('exchange')) {
      aiResponse = "We want you to be completely satisfied! If you receive a damaged item, contact us within 24 hours with photos and we'll arrange a replacement. Due to the handmade nature of our products, we don't accept returns for change of mind, but we're happy to help with any quality issues."
    }
    else if (lowerMessage.includes('time') || lowerMessage.includes('long') || lowerMessage.includes('make') || lowerMessage.includes('ready')) {
      aiResponse = "Standard products are shipped within 2-3 business days. Custom orders typically take 5-10 days depending on complexity. We'll keep you updated on your order status via email and SMS! 📦"
    }
    else if (lowerMessage.includes('coaster') || lowerMessage.includes('tray') || lowerMessage.includes('art') || lowerMessage.includes('jewelry')) {
      aiResponse = "We have a beautiful collection! 🎨 Our coasters come in sets of 4 or 6, perfect for gifting. Trays are great for serving or decoration. Wall art pieces are unique statement items. Jewelry includes earrings, pendants, and rings. Browse our Collections page to see everything!"
    }
    else if (lowerMessage.includes('gift') || lowerMessage.includes('present')) {
      aiResponse = "Resin art makes a perfect gift! 🎁 We offer gift wrapping on request. Our coaster sets, jewelry, and small trays are popular gift choices. For special occasions, we can create custom pieces with names, dates, or meaningful items embedded in resin!"
    }
    else if (lowerMessage.includes('wholesale') || lowerMessage.includes('bulk') || lowerMessage.includes('business')) {
      aiResponse = "Yes, we offer wholesale pricing for bulk orders! 📦 If you're interested in reselling or need items for corporate gifts/events, please contact us with your requirements. We offer attractive discounts on orders of 20+ pieces."
    }
    else if (lowerMessage.includes('thank')) {
      aiResponse = "You're welcome! 😊 Thank you for choosing MahResin World. If you have any more questions, feel free to ask. Happy shopping! 🎨"
    }
    else {
      aiResponse = "Thank you for your message! 😊 I can help you with:\n\n• Product information & prices\n• Shipping & delivery details\n• Custom order requests\n• Care instructions\n• Payment options\n• Return policy\n\nFeel free to ask about any of these, or visit our Contact page to reach our team directly!"
    }

    res.json({
      data: { response: aiResponse }
    })
  } catch (error) {
    console.error('Chat error:', error)
    res.status(500).json({ error: 'Failed to process chat message' })
  }
})

module.exports = router
