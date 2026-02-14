const express = require('express')
const router = express.Router()
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// Get all contact messages
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    res.json({ data })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Submit contact form
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required' })
    }

    const { data, error } = await supabase
      .from('contact_messages')
      .insert([{ name, email, subject, message }])
      .select()
      .single()

    if (error) throw error
    res.status(201).json({ data, message: 'Message sent successfully' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Delete contact message
router.delete('/:id', async (req, res) => {
  try {
    const { error } = await supabase
      .from('contact_messages')
      .delete()
      .eq('id', req.params.id)

    if (error) throw error
    res.json({ message: 'Message deleted' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router
