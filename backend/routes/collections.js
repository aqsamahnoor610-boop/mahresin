const express = require('express')
const router = express.Router()
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// Get all collections
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('collections')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    res.json({ data })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get single collection
router.get('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('collections')
      .select('*')
      .eq('id', req.params.id)
      .single()

    if (error) throw error
    res.json({ data })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Create collection
router.post('/', async (req, res) => {
  try {
    const { title, description, image_url } = req.body
    console.log('Creating collection:', { title, description, hasImage: !!image_url })

    const { data, error } = await supabase
      .from('collections')
      .insert([{ title, description, image_url }])
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      throw error
    }
    console.log('Collection created:', data.id)
    res.status(201).json({ data })
  } catch (error) {
    console.error('Create collection error:', error.message)
    res.status(500).json({ error: error.message })
  }
})

// Update collection
router.put('/:id', async (req, res) => {
  try {
    const { title, description, image_url } = req.body
    console.log('Updating collection:', req.params.id, { title, description, hasImage: !!image_url })

    const { data, error } = await supabase
      .from('collections')
      .update({ title, description, image_url })
      .eq('id', req.params.id)
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      throw error
    }
    console.log('Collection updated:', data.id)
    res.json({ data })
  } catch (error) {
    console.error('Update collection error:', error.message)
    res.status(500).json({ error: error.message })
  }
})

// Delete collection
router.delete('/:id', async (req, res) => {
  try {
    const { error } = await supabase
      .from('collections')
      .delete()
      .eq('id', req.params.id)

    if (error) throw error
    res.json({ message: 'Collection deleted' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router
