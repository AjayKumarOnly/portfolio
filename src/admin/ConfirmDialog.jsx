import { useState } from 'react'
import { deleteProject } from '../firebase/firestore'
import { Spinner, AlertIcon } from '../components/Icons'

/**
 * Delete confirmation. The Firestore document is only deleted
 * after the admin explicitly confirms.
 */
export default function ConfirmDialog({ project, onClose, onDeleted }) {
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState(null)

  const confirm = async () => {
    setDeleting(true)
    setError(null)
    try {
      await deleteProject(project.id)
      onDeleted(`"${project.title}" deleted.`)
    } catch (deleteError) {
      setError(deleteError.message)
      setDeleting(false)
    }
  }

  return (
    <div
      className="admin-modal"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="confirm-heading"
      aria-describedby="confirm-body"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !deleting) onClose()
      }}
    >
      <div className="admin-modal__panel admin-modal__panel--narrow">
        <header className="admin-modal__header">
          <h2 className="admin-modal__title" id="confirm-heading">
            Delete project
          </h2>
        </header>

        <div className="confirm__body">
          <span className="confirm__icon" aria-hidden="true">
            <AlertIcon size={22} />
          </span>
          <p id="confirm-body">
            Are you sure you want to delete{' '}
            <strong>“{project.title}”</strong>? This action cannot be undone.
          </p>
        </div>

        {error && (
          <p className="admin-form__error" role="alert">
            <AlertIcon size={14} /> {error}
          </p>
        )}

        <footer className="admin-modal__footer">
          <button type="button" className="btn btn--neutral" onClick={onClose} disabled={deleting}>
            Cancel
          </button>
          <button
            type="button"
            className="btn btn--danger"
            onClick={confirm}
            disabled={deleting}
          >
            {deleting ? (
              <>
                <Spinner /> Deleting…
              </>
            ) : (
              'Delete'
            )}
          </button>
        </footer>
      </div>
    </div>
  )
}
