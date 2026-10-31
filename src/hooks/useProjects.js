import { useEffect, useState } from 'react'
import { isFirebaseConfigured } from '../firebase/config'
import { subscribeToProjects } from '../firebase/firestore'

const SETUP_ERROR =
  'Project data is not connected yet. Firebase environment variables are missing — see .env.example for setup.'

/**
 * Single data hook for reading projects.
 *
 * Projects are fetched from Firestore in real-time:
 *
 *   React ──▶ Firestore ──▶ projects ──▶ UI
 *
 * React state here is ONLY current-UI state — the database is
 * the one and only source of truth.
 */
export function useProjects() {
  const [projects, setProjects] = useState([])
  const [status, setStatus] = useState(isFirebaseConfigured ? 'loading' : 'error') // 'loading' | 'ready' | 'error'
  const [error, setError] = useState(isFirebaseConfigured ? null : SETUP_ERROR)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    if (!isFirebaseConfigured) return undefined

    // Real-time subscription — Firestore pushes updates to every
    // connected client (portfolio AND admin).
    const unsubscribe = subscribeToProjects({
      onReady: (next) => {
        setProjects(next)
        setStatus('ready')
      },
      onError: (message) => {
        setStatus('error')
        setError(message)
      },
    })

    return () => unsubscribe()
  }, [attempt])

  return {
    projects,
    isLoading: status === 'loading',
    isError: status === 'error',
    error,
    /** Re-attempt the subscription after a failure. */
    retry: () => {
      setStatus('loading')
      setError(null)
      setAttempt((current) => current + 1)
    },
  }
}
