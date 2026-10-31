import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom'
import { useEffect, lazy, Suspense } from 'react'
import Home from './pages/Home'
import { Spinner } from './components/Icons'

// The admin area (Firebase Auth SDK + dashboard) is code-split so
// public visitors never download it.
const AdminLogin = lazy(() => import('./pages/AdminLogin'))
const AdminArea = lazy(() => import('./components/AdminArea'))

function AdminFallback() {
  return (
    <div className="admin-route-loading" role="status" aria-live="polite">
      <Spinner size={20} />
      <span>Loading…</span>
    </div>
  )
}

/** Scroll to top whenever the route changes so anchors/routes feel right. */
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])
  return null
}

function NotFound() {
  return (
    <main className="not-found">
      <p className="not-found__code">404</p>
      <h1>Page not found</h1>
      <p>The page you're looking for doesn't exist.</p>
      <Link className="btn btn--primary" to="/">
        ← Back to portfolio
      </Link>
    </main>
  )
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Public portfolio */}
        <Route path="/" element={<Home />} />

        {/* Hidden admin area — never linked from public navigation */}
        <Route
          path="/admin/login"
          element={
            <Suspense fallback={<AdminFallback />}>
              <AdminLogin />
            </Suspense>
          }
        />
        <Route
          path="/admin"
          element={
            <Suspense fallback={<AdminFallback />}>
              <AdminArea />
            </Suspense>
          }
        />

        <Route path="/index.html" element={<Navigate to="/" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}
