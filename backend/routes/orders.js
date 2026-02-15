const express = require('express')
const router = express.Router()
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// Get all orders (admin) or user orders
router.get('/', async (req, res) => {
  try {
    const { user_id, status } = req.query
    console.log('Fetching orders:', { user_id, status })

    let query = supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })

    if (user_id) {
      query = query.eq('user_id', user_id)
    }

    if (status) {
      query = query.eq('status', status)
    }

    const { data, error } = await query

    if (error) {
      console.error('Supabase error:', error)
      throw error
    }
    
    console.log('Orders found:', data?.length || 0)
    res.json({ data })
  } catch (error) {
    console.error('Get orders error:', error.message)
    res.status(500).json({ error: error.message })
  }
})

// Get single order
router.get('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', req.params.id)
      .single()

    if (error) throw error
    res.json({ data })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Create order
router.post('/', async (req, res) => {
  try {
    const { user_id, user_email, items, total, shipping_address, payment_method } = req.body
    
    console.log('Creating order:', { user_id, user_email, itemsCount: items?.length, total })

    const { data, error } = await supabase
      .from('orders')
      .insert([{ 
        user_id: user_id || null, 
        user_email: user_email || null,
        items, 
        total, 
        shipping_address,
        payment_method: payment_method || 'cod',
        status: 'pending'
      }])
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      throw error
    }
    
    console.log('Order created:', data.id)
    res.status(201).json({ data })
  } catch (error) {
    console.error('Create order error:', error.message)
    res.status(500).json({ error: error.message })
  }
})

// Update order status
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body

    const { data, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', req.params.id)
      .select()
      .single()

    if (error) throw error
    res.json({ data })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Delete order
router.delete('/:id', async (req, res) => {
  try {
    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('id', req.params.id)

    if (error) throw error
    res.json({ message: 'Order deleted' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router
