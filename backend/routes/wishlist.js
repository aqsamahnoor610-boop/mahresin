const express = require('express')
const router = express.Router()
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// Get user wishlist
router.get('/:userId', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('wishlist')
      .select('*, products(*)')
      .eq('user_id', req.params.userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    res.json({ data })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Add to wishlist
router.post('/', async (req, res) => {
  try {
    const { user_id, product_id } = req.body

    // Check if already in wishlist
    const { data: existing } = await supabase
      .from('wishlist')
      .select('*')
      .eq('user_id', user_id)
      .eq('product_id', product_id)
      .single()

    if (existing) {
      return res.status(400).json({ error: 'Already in wishlist' })
    }

    const { data, error } = await supabase
      .from('wishlist')
      .insert([{ user_id, product_id }])
      .select('*, products(*)')
      .single()

    if (error) throw error
    res.status(201).json({ data })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Remove from wishlist
router.delete('/:userId/:productId', async (req, res) => {
  try {
    const { error } = await supabase
      .from('wishlist')
      .delete()
      .eq('user_id', req.params.userId)
      .eq('product_id', req.params.productId)

    if (error) throw error
    res.json({ message: 'Removed from wishlist' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router
