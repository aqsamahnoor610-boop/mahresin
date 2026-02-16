// Vercel Serverless Function - Orders API
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
    // GET - fetch all orders
    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      return res.json({ data })
    }

    // POST - create order
    if (req.method === 'POST') {
      const { user_id, items, total, status, shipping_address, payment_method } = req.body
      
      const { data, error } = await supabase
        .from('orders')
        .insert([{ user_id, items, total, status: status || 'pending', shipping_address, payment_method }])
        .select()
        .single()

      if (error) throw error
      return res.status(201).json({ data })
    }

    return res.status(405).json({ error: 'Method not allowed' })
  } catch (error) {
    console.error('Orders API error:', error)
    return res.status(500).json({ error: error.message })
  }
}
