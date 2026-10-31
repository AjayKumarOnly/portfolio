import ProtectedRoute from './ProtectedRoute'
import AdminDashboard from '../pages/AdminDashboard'

/**
 * Lazily loaded bridge for the /admin route — keeps the whole
 * Firebase Auth + dashboard payload out of the public bundle
 * until an admin route is actually visited.
 */
export default function AdminArea() {
  return (
    <ProtectedRoute>
      <AdminDashboard />
    </ProtectedRoute>
  )
}
