const express = require('express')
const router = express.Router()
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// Get all blogs
router.get('/', async (req, res) => {
  try {
    const { published } = req.query

    let query = supabase
      .from('blogs')
      .select('*')
      .order('created_at', { ascending: false })

    if (published === 'true') {
      query = query.eq('published', true)
    }

    const { data, error } = await query

    if (error) throw error
    res.json({ data })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get single blog
router.get('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .eq('id', req.params.id)
      .single()

    if (error) throw error
    res.json({ data })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Create blog
router.post('/', async (req, res) => {
  try {
    const { title, content, excerpt, image_url, published } = req.body

    const { data, error } = await supabase
      .from('blogs')
      .insert([{ 
        title, 
        content, 
        excerpt, 
        image_url, 
        published: published !== false 
      }])
      .select()
      .single()

    if (error) throw error
    res.status(201).json({ data })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Update blog
router.put('/:id', async (req, res) => {
  try {
    const { title, content, excerpt, image_url, published } = req.body

    const { data, error } = await supabase
      .from('blogs')
      .update({ title, content, excerpt, image_url, published })
      .eq('id', req.params.id)
      .select()
      .single()

    if (error) throw error
    res.json({ data })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Delete blog
router.delete('/:id', async (req, res) => {
  try {
    const { error } = await supabase
      .from('blogs')
      .delete()
      .eq('id', req.params.id)

    if (error) throw error
    res.json({ message: 'Blog deleted' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router
