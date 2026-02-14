const express = require('express')
const router = express.Router()
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// Get all products
router.get('/', async (req, res) => {
  try {
    const { collection_id, featured } = req.query

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

    const { data, error } = await query

    if (error) throw error
    res.json({ data })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*, collections(title)')
      .eq('id', req.params.id)
      .single()

    if (error) throw error
    res.json({ data })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Create product
router.post('/', async (req, res) => {
  try {
    const { title, description, price, stock, images, collection_id, featured } = req.body

    const { data, error } = await supabase
      .from('products')
      .insert([{ 
        title, 
        description, 
        price, 
        stock: stock || 0, 
        images: images || [], 
        collection_id: collection_id || null,
        featured: featured || false
      }])
      .select()
      .single()

    if (error) throw error
    res.status(201).json({ data })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Update product
router.put('/:id', async (req, res) => {
  try {
    const { title, description, price, stock, images, collection_id, featured } = req.body

    const { data, error } = await supabase
      .from('products')
      .update({ 
        title, 
        description, 
        price, 
        stock, 
        images, 
        collection_id,
        featured
      })
      .eq('id', req.params.id)
      .select()
      .single()

    if (error) throw error
    res.json({ data })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Delete product
router.delete('/:id', async (req, res) => {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', req.params.id)

    if (error) throw error
    res.json({ message: 'Product deleted' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router
