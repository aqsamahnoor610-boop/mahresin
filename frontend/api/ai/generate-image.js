// Vercel Serverless Function - AI Image Generator

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

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

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
}
