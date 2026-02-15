const express = require('express')
const router = express.Router()

// AI Image Generation - using Pollinations.ai (free, no API key needed)
router.post('/generate-image', async (req, res) => {
  try {
    const { prompt } = req.body

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' })
    }

    console.log('Generating AI image for:', prompt)

    // Enhance prompt for better resin art results
    const enhancedPrompt = `beautiful resin art ${prompt}, epoxy resin, handcrafted, artistic, colorful, glossy finish, professional product photography, high quality`
    const encodedPrompt = encodeURIComponent(enhancedPrompt)
    
    // Use Pollinations.ai - free AI image generation
    const pollinationsUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=512&height=512&nologo=true`
    
    console.log('Fetching AI image from Pollinations...')
    
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 60000)
      
      const response = await fetch(pollinationsUrl, {
        headers: { 'User-Agent': 'Mozilla/5.0' },
        signal: controller.signal
      })
      
      clearTimeout(timeoutId)
      
      if (response.ok) {
        const arrayBuffer = await response.arrayBuffer()
        const base64 = Buffer.from(arrayBuffer).toString('base64')
        const contentType = response.headers.get('content-type') || 'image/jpeg'
        const dataUrl = `data:${contentType};base64,${base64}`
        
        console.log('AI Image generated! Size:', base64.length)
        
        return res.json({
          imageUrl: dataUrl,
          prompt: prompt,
          message: 'AI-generated design concept! Request a quote for custom resin art based on this design.'
        })
      }
      
      console.log('Pollinations returned:', response.status)
    } catch (err) {
      console.log('Pollinations error:', err.message)
    }

    // Fallback to Lorem Picsum if Pollinations fails
    console.log('Falling back to Picsum...')
    const seed = prompt.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) + Date.now() % 1000
    const picsumUrl = `https://picsum.photos/seed/${seed}/512/512`
    
    try {
      const response = await fetch(picsumUrl, {
        headers: { 'User-Agent': 'Mozilla/5.0' },
        redirect: 'follow'
      })
      
      if (response.ok) {
        const arrayBuffer = await response.arrayBuffer()
        const base64 = Buffer.from(arrayBuffer).toString('base64')
        const dataUrl = `data:image/jpeg;base64,${base64}`
        
        return res.json({
          imageUrl: dataUrl,
          prompt: prompt,
          message: 'Design inspiration generated - Request a custom quote!'
        })
      }
    } catch (err) {
      console.log('Picsum error:', err.message)
    }

    // Ultra fallback
    res.json({
      imageUrl: 'https://via.placeholder.com/512x512/1a5c4b/f4b400?text=Design+Concept',
      prompt: prompt,
      message: 'Describe your design for a custom quote!'
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
