// Vercel Serverless Function - Products API
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

  try {
    // GET - fetch products with optional filters
    if (req.method === 'GET') {
      const { collection_id, featured, search, limit } = req.query
      
      let query = supabase
        .from('products')
        .select('*, collections(title)')
        .order('created_at', { ascending: false })

      if (collection_id) {
        query = query.eq('collection_id', collection_id)
      }
      if (featured === 'true') {
        query = query.eq('featured', true)
      }
      if (search) {
        query = query.ilike('name', `%${search}%`)
      }
      if (limit) {
        query = query.limit(parseInt(limit))
      }

      const { data, error } = await query
      if (error) throw error
      return res.json({ data })
    }

    // POST - create product
    if (req.method === 'POST') {
      const { name, description, price, image_url, collection_id, featured, stock, sku } = req.body
      
      const { data, error } = await supabase
        .from('products')
        .insert([{ name, description, price, image_url, collection_id, featured, stock, sku }])
        .select()
        .single()

      if (error) throw error
      return res.status(201).json({ data })
    }

    return res.status(405).json({ error: 'Method not allowed' })
  } catch (error) {
    console.error('Products API error:', error)
    return res.status(500).json({ error: error.message })
  }
}
