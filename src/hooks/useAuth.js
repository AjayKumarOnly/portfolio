import { useEffect, useState } from 'react'
import { isFirebaseConfigured } from '../firebase/config'
import { observeAuth } from '../firebase/auth'

/**
 * Tracks the Firebase Authentication user.
 * Returns { user, loading } — while `loading` is true the app
 * must not render any auth-dependent views yet.
 */
export function useAuthUser() {
  const [user, setUser] = useState(null)
  // Loading is only ever true when Firebase is wired up.
  const [loading, setLoading] = useState(isFirebaseConfigured)

  useEffect(() => {
    if (!isFirebaseConfigured) return undefined

    let unsubscribe

    async function init() {
      try {
        unsubscribe = observeAuth((nextUser) => {
          setUser(nextUser ?? null)
          setLoading(false)
        })
      } catch (error) {
        // Firebase failed to initialize — surface it via console and
        // stop blocking the UI. Auth-protected areas show the error
        // through other means.
        console.error('Auth init failed:', error)
        setLoading(false)
      }
    }

    init()
    return () => unsubscribe?.()
  }, [])

  return { user, loading }
}
