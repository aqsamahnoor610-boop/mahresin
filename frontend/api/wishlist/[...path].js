// Vercel Serverless Function - Wishlist by User API
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
  const userId = pathParts[0]
  const productId = pathParts[1]

  try {
    // GET wishlist for user
    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('wishlist')
        .select('*, products(*)')
        .eq('user_id', userId)

      if (error) throw error
      return res.json({ data })
    }

    // DELETE wishlist item
    if (req.method === 'DELETE' && productId) {
      const { error } = await supabase
        .from('wishlist')
        .delete()
        .eq('user_id', userId)
        .eq('product_id', productId)

      if (error) throw error
      return res.json({ message: 'Removed from wishlist' })
    }

    return res.status(405).json({ error: 'Method not allowed' })
  } catch (error) {
    console.error('Wishlist API error:', error)
    return res.status(500).json({ error: error.message })
  }
}
