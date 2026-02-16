// Vercel Serverless Function - Reviews by Path API
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY
)

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  const pathParts = req.query.path || []

  try {
    // /reviews/product/[productId]
    if (pathParts[0] === 'product' && pathParts[1]) {
      const productId = pathParts[1]
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('product_id', productId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return res.json({ data })
    }

    // /reviews/[id] - DELETE
    if (req.method === 'DELETE' && pathParts[0]) {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', pathParts[0])

      if (error) throw error
      return res.json({ message: 'Review deleted' })
    }

    return res.status(405).json({ error: 'Method not allowed' })
  } catch (error) {
    console.error('Reviews API error:', error)
    return res.status(500).json({ error: error.message })
  }
}
