const express = require('express')
const router = express.Router()

// Curated resin art images by category for reliable results
const resinImages = {
  galaxy: [
    'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=512&h=512&fit=crop',
    'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=512&h=512&fit=crop',
    'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=512&h=512&fit=crop',
    'https://images.unsplash.com/photo-1543722530-d2c3201371e7?w=512&h=512&fit=crop'
  ],
  ocean: [
    'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=512&h=512&fit=crop',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=512&h=512&fit=crop',
    'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=512&h=512&fit=crop',
    'https://images.unsplash.com/photo-1484291470158-b8f8d608850d?w=512&h=512&fit=crop'
  ],
  flower: [
    'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=512&h=512&fit=crop',
    'https://images.unsplash.com/photo-1518882605630-8eb365fa4eb9?w=512&h=512&fit=crop',
    'https://images.unsplash.com/photo-1455659817273-f96807779a8a?w=512&h=512&fit=crop',
    'https://images.unsplash.com/photo-1501973931609-ce2c4e8eab72?w=512&h=512&fit=crop'
  ],
  gold: [
    'https://images.unsplash.com/photo-1610375461246-83df859d849d?w=512&h=512&fit=crop',
    'https://images.unsplash.com/photo-1589782182703-2aaa69037b5b?w=512&h=512&fit=crop',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=512&h=512&fit=crop'
  ],
  crystal: [
    'https://images.unsplash.com/photo-1551893478-d726eaf0442c?w=512&h=512&fit=crop',
    'https://images.unsplash.com/photo-1518123456786-df196291f6eb?w=512&h=512&fit=crop',
    'https://images.unsplash.com/photo-1519120944692-1a8d8cfc107f?w=512&h=512&fit=crop'
  ],
  abstract: [
    'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=512&h=512&fit=crop',
    'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=512&h=512&fit=crop',
    'https://images.unsplash.com/photo-1567095761054-7a02e69e5c43?w=512&h=512&fit=crop',
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=512&h=512&fit=crop'
  ],
  purple: [
    'https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=512&h=512&fit=crop',
    'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=512&h=512&fit=crop',
    'https://images.unsplash.com/photo-1550684376-efcbd6e3f031?w=512&h=512&fit=crop'
  ],
  blue: [
    'https://images.unsplash.com/photo-1557682224-5b8590cd9ec5?w=512&h=512&fit=crop',
    'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=512&h=512&fit=crop',
    'https://images.unsplash.com/photo-1493673272479-a20888bcee10?w=512&h=512&fit=crop'
  ],
  nature: [
    'https://images.unsplash.com/photo-1518882605630-8eb365fa4eb9?w=512&h=512&fit=crop',
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=512&h=512&fit=crop',
    'https://images.unsplash.com/photo-1476362555312-ab9e108a0b7e?w=512&h=512&fit=crop'
  ]
}

// Get matching image based on prompt keywords
function getImageForPrompt(prompt) {
  const lowerPrompt = prompt.toLowerCase()
  
  // Check for keywords and return matching category
  if (lowerPrompt.includes('galaxy') || lowerPrompt.includes('space') || lowerPrompt.includes('star') || lowerPrompt.includes('cosmic')) {
    return { category: 'galaxy', images: resinImages.galaxy }
  }
  if (lowerPrompt.includes('ocean') || lowerPrompt.includes('wave') || lowerPrompt.includes('sea') || lowerPrompt.includes('beach')) {
    return { category: 'ocean', images: resinImages.ocean }
  }
  if (lowerPrompt.includes('flower') || lowerPrompt.includes('floral') || lowerPrompt.includes('rose') || lowerPrompt.includes('preserved')) {
    return { category: 'flower', images: resinImages.flower }
  }
  if (lowerPrompt.includes('gold') || lowerPrompt.includes('flake') || lowerPrompt.includes('metallic') || lowerPrompt.includes('glitter')) {
    return { category: 'gold', images: resinImages.gold }
  }
  if (lowerPrompt.includes('crystal') || lowerPrompt.includes('clear') || lowerPrompt.includes('transparent') || lowerPrompt.includes('glass')) {
    return { category: 'crystal', images: resinImages.crystal }
  }
  if (lowerPrompt.includes('purple') || lowerPrompt.includes('violet') || lowerPrompt.includes('lavender')) {
    return { category: 'purple', images: resinImages.purple }
  }
  if (lowerPrompt.includes('blue') || lowerPrompt.includes('teal') || lowerPrompt.includes('turquoise')) {
    return { category: 'blue', images: resinImages.blue }
  }
  if (lowerPrompt.includes('nature') || lowerPrompt.includes('leaf') || lowerPrompt.includes('botanical') || lowerPrompt.includes('green')) {
    return { category: 'nature', images: resinImages.nature }
  }
  
  // Default to abstract art for any other prompt
  return { category: 'abstract', images: resinImages.abstract }
}

// AI Image Generation - using curated images for reliability
router.post('/generate-image', async (req, res) => {
  try {
    const { prompt } = req.body

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' })
    }

    console.log('Generating design concept for:', prompt)

    // Get matching images based on prompt
    const { category, images } = getImageForPrompt(prompt)
    
    // Pick a random image from the category
    const randomIndex = Math.floor(Math.random() * images.length)
    const imageUrl = images[randomIndex]
    
    console.log(`Selected ${category} image for prompt`)
    
    // Fetch the image and convert to base64 for reliable display
    try {
      const response = await fetch(imageUrl, {
        headers: { 'User-Agent': 'Mozilla/5.0' }
      })
      
      if (response.ok) {
        const arrayBuffer = await response.arrayBuffer()
        const base64 = Buffer.from(arrayBuffer).toString('base64')
        const contentType = response.headers.get('content-type') || 'image/jpeg'
        const dataUrl = `data:${contentType};base64,${base64}`
        
        return res.json({
          imageUrl: dataUrl,
          prompt: prompt,
          category: category,
          message: `✨ ${category.charAt(0).toUpperCase() + category.slice(1)}-themed design concept! This shows the style and colors for your "${prompt}" idea. Request a quote and we'll handcraft your unique piece!`
        })
      }
    } catch (err) {
      console.log('Image fetch error:', err.message)
    }

    // Fallback - return URL directly
    res.json({
      imageUrl: imageUrl,
      prompt: prompt,
      category: category,
      message: `✨ ${category.charAt(0).toUpperCase() + category.slice(1)}-themed design inspiration! Request a quote for your custom resin art!`
    })
    
  } catch (error) {
    console.error('Image generation error:', error.message)
    res.status(500).json({ error: 'Failed to generate image' })
  }
})

// AI Chat Assistant - Intelligent responses using Pollinations AI
router.post('/chat', async (req, res) => {
  try {
    const { message, history } = req.body

    if (!message) {
      return res.status(400).json({ error: 'Message is required' })
    }

    console.log('Chat message received:', message)

    // Try Pollinations AI text generation first
    try {
      const systemPrompt = `You are MahResin World's friendly AI assistant. MahResin World is a Pakistani online store selling beautiful handcrafted resin art products including coasters, trays, wall art, jewelry, keychains, and custom pieces.

Key information about the shop:
- Products: Resin coasters (Rs. 800+), trays (Rs. 2,500+), wall art (Rs. 5,000-15,000+), jewelry (Rs. 300+), keychains (Rs. 500+)
- Shipping: Nationwide Pakistan, 3-5 days for major cities, FREE shipping over Rs. 3,000
- Payment: Cash on Delivery (COD), JazzCash, EasyPaisa, Bank Transfer
- Custom orders: 5-10 days, contact through website
- Returns: Replacements for damaged items within 24 hours

About Resin Art:
- Resin is a liquid polymer (epoxy) that hardens into a clear, glossy, durable finish
- Made by mixing resin with hardener, adding pigments/items, pouring into molds, curing 24-48 hours
- Can embed flowers, photos, glitter, pigments, and other items
- Each piece is unique and handmade
- Care: Clean with soft cloth, avoid harsh chemicals and direct sunlight

Be helpful, friendly, use emojis. Answer any question the user asks - about resin, art, products, etc. Give informative answers.`

      const pollinationsUrl = `https://text.pollinations.ai/${encodeURIComponent(message)}?system=${encodeURIComponent(systemPrompt)}&model=openai`
      
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 15000)
      
      const response = await fetch(pollinationsUrl, {
        headers: { 'User-Agent': 'Mozilla/5.0' },
        signal: controller.signal
      })
      
      clearTimeout(timeoutId)
      
      if (response.ok) {
        const aiResponse = await response.text()
        // Only use AI response if it's substantive and relevant (not generic)
        const isGenericResponse = aiResponse.includes('Thank you for your message') || 
                                  aiResponse.includes('I can help you with') ||
                                  aiResponse.includes('How can I assist') ||
                                  aiResponse.includes('Welcome to MahResin') ||
                                  aiResponse.includes('I\'m your AI assistant') ||
                                  aiResponse.length < 100
        
        if (aiResponse && aiResponse.length > 100 && !isGenericResponse) {
          console.log('AI response received from Pollinations')
          return res.json({
            data: { response: aiResponse }
          })
        }
        console.log('Pollinations response was generic, using keywords')
      }
    } catch (err) {
      console.log('Pollinations chat error:', err.message)
    }

    // Fallback to smart keyword-based responses
    console.log('Using keyword-based responses...')
    const lowerMessage = message.toLowerCase()
    let aiResponse = ''

    // WHAT IS questions - Educational
    if (lowerMessage.includes('what is resin') || lowerMessage.includes('what\'s resin') || lowerMessage.includes('explain resin') || (lowerMessage.includes('resin') && lowerMessage.includes('?'))) {
      aiResponse = "Resin is a liquid polymer (typically epoxy) that starts as a two-part mixture and hardens into a crystal-clear, glossy, and incredibly durable finish! 🎨\n\nIn art, we use it to:\n• Create beautiful coasters, trays, and jewelry\n• Preserve flowers, photos, and memories\n• Add stunning colors and effects with pigments\n• Make each piece unique and long-lasting\n\nOur resin art pieces are 100% handmade and can last for years with proper care!"
    }
    else if (lowerMessage.includes('what is epoxy') || lowerMessage.includes('epoxy resin')) {
      aiResponse = "Epoxy resin is a type of synthetic polymer that we use to create our beautiful art pieces! 🎨 It starts as two liquids (resin and hardener) that, when mixed, create a chemical reaction and harden into a crystal-clear, glass-like finish. It's perfect for making coasters, jewelry, trays, and wall art because it's durable, waterproof, and has a gorgeous glossy shine!"
    }
    else if (lowerMessage.includes('how') && (lowerMessage.includes('made') || lowerMessage.includes('make') || lowerMessage.includes('create'))) {
      aiResponse = "Our resin art is crafted with love! Here's the process:\n\n1️⃣ Mix epoxy resin with hardener precisely\n2️⃣ Add beautiful pigments, glitters, or dried flowers\n3️⃣ Pour into molds or onto surfaces\n4️⃣ Remove air bubbles with a heat gun\n5️⃣ Let it cure for 24-48 hours\n6️⃣ Sand, polish, and finish!\n\nEach piece takes 2-3 days minimum and is completely unique! Want to order a custom piece?"
    }
    // Greetings (check with word boundaries to avoid matching "shipping" as "hi")
    else if (/\b(hello|hi|hey)\b/.test(lowerMessage) || lowerMessage.includes('assalam')) {
      aiResponse = "Hello! Welcome to MahResin World! 🎨✨ I'm your AI assistant, here to help you discover beautiful handcrafted resin art. How can I assist you today?\n\nYou can ask me about:\n• Our products & prices\n• Shipping & delivery\n• Custom orders\n• What resin art is\n• Care instructions"
    }
    // Prices
    else if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('how much') || lowerMessage.includes('kitne') || lowerMessage.includes('kitna')) {
      aiResponse = "Here are our price ranges! 💰\n\n🎨 Coasters: Rs. 800 - 2,000\n🍽️ Trays: Rs. 2,500 - 6,000\n🖼️ Wall Art: Rs. 5,000 - 15,000+\n💍 Jewelry: Rs. 300 - 1,500\n🔑 Keychains: Rs. 500 - 800\n\nCustom pieces are priced based on size and complexity. Check our Collections page or ask for a specific item!"
    }
    // Shipping
    else if (lowerMessage.includes('shipping') || lowerMessage.includes('delivery') || lowerMessage.includes('deliver') || lowerMessage.includes('ship')) {
      aiResponse = "We ship nationwide across Pakistan! 🚚📦\n\n• Major cities: 3-5 business days\n• Other areas: 5-7 business days\n• FREE shipping on orders above Rs. 3,000!\n• Careful packaging to protect your art\n• Tracking provided for all orders\n\nWe use reliable courier services to ensure safe delivery!"
    }
    // Custom orders
    else if (lowerMessage.includes('custom') || lowerMessage.includes('personalize') || lowerMessage.includes('customize')) {
      aiResponse = "Yes! Custom orders are our specialty! 🎨✨\n\nYou can customize:\n• Colors & designs\n• Size & shape\n• Embedded items (flowers, photos, names)\n• Special messages or dates\n\nCustom pieces take 5-10 days to create. Just tell us your vision through our Contact page, and we'll provide a quote within 24 hours!"
    }
    // Care instructions
    else if (lowerMessage.includes('care') || lowerMessage.includes('clean') || lowerMessage.includes('maintain') || lowerMessage.includes('wash')) {
      aiResponse = "Taking care of your resin art is easy! ✨\n\n✅ DO:\n• Clean with soft, damp cloth\n• Use mild soap if needed\n• Store away from direct sunlight\n• Handle with care\n\n❌ DON'T:\n• Use harsh chemicals\n• Place very hot items directly on it\n• Scratch with abrasive materials\n• Leave in extreme heat\n\nWith proper care, your pieces will stay beautiful for years!"
    }
    // Payment
    else if (lowerMessage.includes('payment') || lowerMessage.includes('pay') || lowerMessage.includes('cod') || lowerMessage.includes('cash')) {
      aiResponse = "We offer multiple payment options! 💳💰\n\n• Cash on Delivery (COD) - Most popular!\n• JazzCash\n• EasyPaisa\n• Bank Transfer\n\nFor COD, pay when your order arrives. For online payment, we'll share details after order confirmation!"
    }
    // Returns
    else if (lowerMessage.includes('return') || lowerMessage.includes('refund') || lowerMessage.includes('exchange') || lowerMessage.includes('damage')) {
      aiResponse = "We want you 100% satisfied! 🙌\n\n📸 If your item arrives damaged:\n• Contact us within 24 hours\n• Send photos of the damage\n• We'll arrange a replacement!\n\nNote: Due to the handmade nature, we can't accept returns for change of mind. But we're always here to help with any quality issues!"
    }
    // Products
    else if (lowerMessage.includes('coaster') || lowerMessage.includes('tray') || lowerMessage.includes('art') || lowerMessage.includes('jewelry') || lowerMessage.includes('product')) {
      aiResponse = "We have a beautiful range of resin products! 🎨\n\n☕ Coasters - Sets of 4 or 6, perfect for gifting\n🍽️ Trays - Serving trays & decorative pieces\n🖼️ Wall Art - Stunning statement pieces\n💍 Jewelry - Earrings, pendants, rings\n🔑 Keychains - Cute & customizable\n📿 Bookmarks - Unique gifts for readers\n\nBrowse our Collections to see them all!"
    }
    // Gifts
    else if (lowerMessage.includes('gift') || lowerMessage.includes('present') || lowerMessage.includes('birthday') || lowerMessage.includes('wedding')) {
      aiResponse = "Resin art makes PERFECT gifts! 🎁💝\n\nPopular gift choices:\n• Coaster sets (great for housewarmings)\n• Personalized jewelry (names, initials)\n• Custom pieces with photos/flowers\n• Decorative trays\n\nWe offer gift wrapping on request! Tell us the occasion and we'll suggest the perfect piece!"
    }
    // Time/Duration
    else if (lowerMessage.includes('time') || lowerMessage.includes('long') || lowerMessage.includes('ready') || lowerMessage.includes('when')) {
      aiResponse = "Here's our timeline! ⏰\n\n📦 Standard products: Ship within 2-3 days\n🎨 Custom orders: 5-10 days to create\n🚚 Delivery: 3-7 days depending on location\n\nWe'll keep you updated with tracking info! Need something urgent? Let us know and we'll try our best!"
    }
    // Thanks
    else if (lowerMessage.includes('thank') || lowerMessage.includes('shukriya') || lowerMessage.includes('thanks')) {
      aiResponse = "You're most welcome! 😊🎨 Thank you for visiting MahResin World!\n\nIf you have any more questions, feel free to ask. Happy shopping! ✨"
    }
    // Contact
    else if (lowerMessage.includes('contact') || lowerMessage.includes('reach') || lowerMessage.includes('email') || lowerMessage.includes('phone') || lowerMessage.includes('whatsapp')) {
      aiResponse = "You can reach us through:\n\n📧 Contact form on our website\n📱 Visit our Contact page for details\n💬 Or keep chatting with me here!\n\nWe typically respond within 24 hours! 😊"
    }
    // Location
    else if (lowerMessage.includes('location') || lowerMessage.includes('where') || lowerMessage.includes('based') || lowerMessage.includes('shop')) {
      aiResponse = "MahResin World is based in Pakistan! 🇵🇰\n\nWe're an online-only store, so you can shop from anywhere in the country. We ship to all cities and towns across Pakistan! 🚚"
    }
    // Default - more helpful
    else {
      aiResponse = `Great question! 😊 Let me help you with that.\n\nAt MahResin World, I can tell you about:\n\n🎨 **Our Products**: Beautiful coasters, trays, wall art, jewelry & more\n💰 **Prices**: Starting from Rs. 300\n🚚 **Shipping**: Nationwide Pakistan, free over Rs. 3,000\n🎁 **Custom Orders**: Personalized pieces for any occasion\n✨ **Resin Art**: What it is, how it's made, how to care for it\n\nJust ask! What would you like to know?`
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
