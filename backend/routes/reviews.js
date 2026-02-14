const express = require('express')
const router = express.Router()
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// Get reviews for a product
router.get('/product/:productId', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('*, profiles(full_name)')
      .eq('product_id', req.params.productId)
      .order('created_at', { ascending: false })

    if (error) throw error
    res.json({ data })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Create review
router.post('/', async (req, res) => {
  try {
    const { user_id, product_id, rating, comment } = req.body

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' })
    }

    const { data, error } = await supabase
      .from('reviews')
      .insert([{ user_id, product_id, rating, comment }])
      .select('*, profiles(full_name)')
      .single()

    if (error) throw error
    res.status(201).json({ data })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Delete review
router.delete('/:id', async (req, res) => {
  try {
    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', req.params.id)

    if (error) throw error
    res.json({ message: 'Review deleted' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router
