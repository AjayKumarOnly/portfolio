import { initializeApp } from 'firebase/app'

/**
 * Central Firebase configuration.
 *
 * Values come from environment variables (.env) — see .env.example.
 * This is the ONLY place in the app where Firebase is initialized.
 */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

/** True when every required env var has been provided. */
export const isFirebaseConfigured = Object.values(firebaseConfig).every(
  (value) => typeof value === 'string' && value.trim() !== ''
)

let app = null

/** Lazily initializes (once) and returns the Firebase App instance. */
export function getApp() {
  if (!isFirebaseConfigured) {
    throw new Error('FIREBASE_NOT_CONFIGURED')
  }
  if (!app) {
    app = initializeApp(firebaseConfig)
  }
  return app
}

/** True when an error (or error overlay) was caused by missing setup. */
export function isNotConfiguredError(error) {
  return error?.message === 'FIREBASE_NOT_CONFIGURED'
}

/**
 * Map SDK errors to messages that are safe to show to users.
 * Raw Firebase error details are never leaked into the UI.
 */
export function describeError(error) {
  const code = String(error?.code ?? '')

  if (isNotConfiguredError(error) || code.includes('invalid-api-key') || code.includes('api-key-not-valid')) {
    return 'Firebase is not configured for this deployment. Check the VITE_FIREBASE_* environment variables.'
  }
  if (code.includes('permission-denied')) {
    return "You don't have permission to perform this action. Make sure you are signed in and the Firestore security rules allow it."
  }
  if (code.includes('unavailable') || code.includes('deadline-exceeded')) {
    return "Couldn't reach the project database. Check your connection and try again."
  }
  if (code.includes('network')) {
    return 'A network error occurred. Please try again.'
  }
  if (code.includes('not-found')) {
    return 'The requested item no longer exists.'
  }
  return 'Something went wrong. Please try again.'
}
