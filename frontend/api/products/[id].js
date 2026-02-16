// Vercel Serverless Function - Single Product API
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

  const { id } = req.query

  try {
    // GET - fetch single product
    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('products')
        .select('*, collections(title)')
        .eq('id', id)
        .single()

      if (error) throw error
      return res.json({ data })
    }

    // PUT - update product
    if (req.method === 'PUT') {
      const { name, description, price, image_url, collection_id, featured, stock, sku } = req.body
      
      const { data, error } = await supabase
        .from('products')
        .update({ name, description, price, image_url, collection_id, featured, stock, sku })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return res.json({ data })
    }

    // DELETE - delete product
    if (req.method === 'DELETE') {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id)

      if (error) throw error
      return res.json({ message: 'Product deleted' })
    }

    return res.status(405).json({ error: 'Method not allowed' })
  } catch (error) {
    console.error('Product API error:', error)
    return res.status(500).json({ error: error.message })
  }
}
