import { getApp } from './config'
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth'

/** The single Firebase Auth instance for the whole app. */
export function getFirebaseAuth() {
  return getAuth(getApp())
}

/**
 * Sign in with Email/Password (Firebase Authentication).
 * Resolves only when Firebase confirms the credentials.
 */
export async function loginAdmin(email, password) {
  try {
    const credential = await signInWithEmailAndPassword(
      getFirebaseAuth(),
      email,
      password
    )
    return credential.user
  } catch (error) {
    throw new Error(describeAuthError(error), { cause: error })
  }
}

export async function logoutAdmin() {
  try {
    await signOut(getFirebaseAuth())
  } catch (error) {
    throw new Error('Failed to sign out. Please try again.', { cause: error })
  }
}

/**
 * Observe the authentication state.
 * Returns an unsubscribe function.
 */
export function observeAuth(callback) {
  return onAuthStateChanged(getFirebaseAuth(), callback)
}

/** Map raw auth errors to safe, human-friendly messages. */
function describeAuthError(error) {
  const code = String(error?.code ?? '')

  switch (true) {
    case code === 'auth/invalid-credential':
    case code === 'auth/wrong-password':
    case code === 'auth/invalid-email':
    case code === 'auth/user-not-found':
      return 'Invalid email or password. Please try again.'
    case code === 'auth/user-disabled':
      return 'This account has been disabled.'
    case code === 'auth/too-many-requests':
      return 'Too many failed attempts. Please wait a moment and try again.'
    case code === 'auth/network-request-failed':
      return 'Network error. Check your connection and try again.'
    default:
      return 'Sign-in failed. Please try again.'
  }
}
