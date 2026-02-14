const express = require('express')
const router = express.Router()
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// Get all users (admin only)
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    res.json({ data })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get single user profile
router.get('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', req.params.id)
      .single()

    if (error) throw error
    res.json({ data })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Update user profile
router.put('/:id', async (req, res) => {
  try {
    const { full_name, phone, address } = req.body

    const { data, error } = await supabase
      .from('profiles')
      .update({ full_name, phone, address })
      .eq('id', req.params.id)
      .select()
      .single()

    if (error) throw error
    res.json({ data })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router
