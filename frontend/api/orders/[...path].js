// Vercel Serverless Function - Single Order & User Orders API
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

  // Handle path like /orders/[id] or /orders/user/[userId]
  const pathParts = req.query.path || []
  
  try {
    // Check if this is a user orders request: /orders/user/[userId]
    if (pathParts[0] === 'user' && pathParts[1]) {
      const userId = pathParts[1]
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return res.json({ data })
    }

    // Check if this is status update: /orders/[id]/status
    if (pathParts[1] === 'status' && req.method === 'PUT') {
      const orderId = pathParts[0]
      const { status } = req.body
      
      const { data, error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId)
        .select()
        .single()

      if (error) throw error
      return res.json({ data })
    }

    // Single order by ID
    const orderId = pathParts[0]

    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single()

      if (error) throw error
      return res.json({ data })
    }

    if (req.method === 'PUT') {
      const { status } = req.body
      
      const { data, error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId)
        .select()
        .single()

      if (error) throw error
      return res.json({ data })
    }

    if (req.method === 'DELETE') {
      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', orderId)

      if (error) throw error
      return res.json({ message: 'Order deleted' })
    }

    return res.status(405).json({ error: 'Method not allowed' })
  } catch (error) {
    console.error('Order API error:', error)
    return res.status(500).json({ error: error.message })
  }
}
