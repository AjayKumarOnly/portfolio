import { getApp, describeError } from './config'
import {
  getFirestore,
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
} from 'firebase/firestore'

const PROJECTS_COLLECTION = 'projects'

/** The single Firestore instance for the whole app. */
export function getDb() {
  return getFirestore(getApp())
}

/* ────────────────────────────────────────────────────────────
   Firestore is the single source of truth.
   Every function here talks directly to Firestore — no local
   caches, no browser storage.
   ──────────────────────────────────────────────────────────── */

/**
 * Real-time subscription to the projects collection,
 * newest first (createdAt DESC).
 *
 * onSnapshot pushes updates automatically, so a project added
 * from the admin panel appears on the live portfolio without
 * a refresh.
 *
 * Returns an unsubscribe function.
 */
export function subscribeToProjects({ onReady, onError }) {
  const q = query(
    collection(getDb(), PROJECTS_COLLECTION),
    orderBy('createdAt', 'desc')
  )

  return onSnapshot(
    q,
    (snapshot) => {
      const projects = snapshot.docs
        .map((entry) => ({
          id: entry.id,
          ...entry.data(),
        }))
        // Defensive sort — docs missing createdAt keep a stable position.
        .sort((a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0))
      onReady(projects)
    },
    (error) => onError(describeError(error))
  )
}

/** Normalizes URLs the same way on write, so reads stay predictable. */
function normalizeUrl(value) {
  if (!value) return ''
  const trimmed = value.trim().replace(/^http:\/\//i, 'https://')
  return trimmed
}

/**
 * Create a project. Resolves only after Firestore CONFIRMS
 * the write (addDoc waits for the server acknowledgement).
 */
export async function addProject({ title, description, githubUrl, liveUrl, technologies }) {
  try {
    const docRef = await addDoc(collection(getDb(), PROJECTS_COLLECTION), {
      title: title.trim(),
      description: description.trim(),
      githubUrl: normalizeUrl(githubUrl),
      liveUrl: normalizeUrl(liveUrl),
      technologies,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
    return docRef.id
  } catch (error) {
    throw new Error(describeError(error), { cause: error })
  }
}

/**
 * Update an existing project document.
 * `updatedAt` is always bumped so edits are traceable.
 */
export async function updateProject(id, { title, description, githubUrl, liveUrl, technologies }) {
  try {
    await updateDoc(doc(getDb(), PROJECTS_COLLECTION, id), {
      title: title.trim(),
      description: description.trim(),
      githubUrl: normalizeUrl(githubUrl),
      liveUrl: normalizeUrl(liveUrl),
      technologies,
      updatedAt: serverTimestamp(),
    })
    return id
  } catch (error) {
    throw new Error(describeError(error), { cause: error })
  }
}

/**
 * Delete a project. Only called after explicit user
 * confirmation in the dashboard.
 */
export async function deleteProject(id) {
  try {
    await deleteDoc(doc(getDb(), PROJECTS_COLLECTION, id))
  } catch (error) {
    throw new Error(describeError(error), { cause: error })
  }
}
