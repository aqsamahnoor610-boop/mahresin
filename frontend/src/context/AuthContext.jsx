import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext({})

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false) // Start as false - don't block!
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    // Quick async check - don't block rendering
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (session?.user) {
          setUser(session.user)
          
          // Check admin status in background
          const { data: profile } = await supabase
            .from('profiles')
            .select('is_admin')
            .eq('id', session.user.id)
            .single()
          
          setIsAdmin(profile?.is_admin || false)
        }
      } catch (error) {
        console.error('Auth init error:', error)
      }
    }

    initAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null)
      
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', session.user.id)
          .single()
        
        setIsAdmin(profile?.is_admin || false)
      } else {
        setIsAdmin(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const value = {
    user,
    loading,
    isAdmin,
    signOut: async () => {
      await supabase.auth.signOut()
      setUser(null)
      setIsAdmin(false)
    }
  }

  // Always render children immediately - no loading screen!
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
