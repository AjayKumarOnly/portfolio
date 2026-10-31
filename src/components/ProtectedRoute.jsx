import { Navigate, useLocation } from 'react-router-dom'
import { useAuthUser } from '../hooks/useAuth'
import { isFirebaseConfigured } from '../firebase/config'
import { Spinner } from './Icons'

/**
 * Route guard for the /admin area.
 * - While Firebase resolves the auth state → loading screen
 *   (no flash of a login form for authenticated admins)
 * - Unauthenticated → redirect to the login screen with the
 *   original target remembered, so admins land back on the
 *   dashboard after signing in.
 */
export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuthUser()
  const location = useLocation()

  if (!isFirebaseConfigured) {
    return <Navigate to="/admin/login" replace />
  }

  if (loading) {
    return (
      <div className="admin-route-loading" role="status" aria-live="polite">
        <Spinner size={22} />
        <span>Checking credentials…</span>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />
  }

  return children
}
