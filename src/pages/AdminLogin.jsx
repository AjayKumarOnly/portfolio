import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { loginAdmin } from '../firebase/auth'
import { isFirebaseConfigured } from '../firebase/config'
import { useAuthUser } from '../hooks/useAuth'
import { Spinner, AlertIcon } from '../components/Icons'
import StatePanel from '../components/StatePanel'

/**
 * Admin authentication — Firebase Authentication (Email/Password).
 * No hardcoded passwords, no browser storage. Sessions live in
 * the Firebase Auth service itself.
 */
export default function AdminLogin() {
  const { user, loading } = useAuthUser()
  const navigate = useNavigate()
  const location = useLocation()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  // Already signed in → straight to the dashboard
  const target = location.state?.from ?? '/admin'
  if (!loading && user) {
    return <Navigate to={target} replace />
  }

  const onSubmit = async (event) => {
    event.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      await loginAdmin(email.trim(), password)
      // Firebase auth succeeded — navigate to the dashboard.
      navigate(target, { replace: true })
    } catch (authError) {
      setError(authError.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="admin-auth">
      <div className="admin-auth__card">
        <div className="admin-auth__brand">
          <span className="admin-auth__mark" aria-hidden="true">
            ◆
          </span>
          <div>
            <p className="admin-auth__kicker">Portfolio Admin</p>
            <h1 className="admin-auth__title">Sign in</h1>
          </div>
        </div>

        {!isFirebaseConfigured ? (
          <StatePanel
            className="state-panel--error"
            icon={<AlertIcon size={22} />}
            title="Firebase is not configured"
            body="Add the VITE_FIREBASE_* variables to your .env file (see .env.example), then restart the dev server."
          />
        ) : (
          <>
            <form className="admin-form" onSubmit={onSubmit} noValidate>
              <div className="admin-form__field">
                <label className="admin-form__label" htmlFor="admin-email">
                  Email
                </label>
                <input
                  className="admin-form__input"
                  id="admin-email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </div>

              <div className="admin-form__field">
                <label className="admin-form__label" htmlFor="admin-password">
                  Password
                </label>
                <div className="admin-form__password">
                  <input
                    className="admin-form__input"
                    id="admin-password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                  />
                  <button
                    type="button"
                    className="admin-form__reveal"
                    onClick={() => setShowPassword((show) => !show)}
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              {error && (
                <p className="admin-form__error" role="alert">
                  <AlertIcon size={14} /> {error}
                </p>
              )}

              <button
                type="submit"
                className="btn btn--primary btn--block"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <Spinner /> Signing in…
                  </>
                ) : (
                  'Sign in'
                )}
              </button>
            </form>

            <p className="admin-auth__hint">
              Authentication is handled by Firebase Authentication.
              Credentials are created in the Firebase console — there is no
              frontend password.
            </p>
          </>
        )}

        <Link className="admin-auth__back" to="/">
          ← Back to portfolio
        </Link>
      </div>
    </div>
  )
}
