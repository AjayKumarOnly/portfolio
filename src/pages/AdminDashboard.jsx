import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useAuthUser } from '../hooks/useAuth'
import { useProjects } from '../hooks/useProjects'
import { logoutAdmin } from '../firebase/auth'
import { isFirebaseConfigured } from '../firebase/config'
import ProjectForm from '../admin/ProjectForm'
import ConfirmDialog from '../admin/ConfirmDialog'
import ProjectCard from '../components/ProjectCard'
import StatePanel from '../components/StatePanel'
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  LogoutIcon,
  AlertIcon,
  RefreshIcon,
  InboxIcon,
  Spinner,
} from '../components/Icons'

/**
 * Hidden admin dashboard — a fast, functional internal tool.
 * Not reachable from public navigation; guarded by Firebase Auth.
 *
 * CRUD flow:
 *   UI ▸ validation ▸ Firestore write (confirmed) ▸ UI update ▸ toast
 * The live Firestore listener keeps the list (and the public
 * portfolio) in sync automatically.
 */
export default function AdminDashboard() {
  const { user, loading } = useAuthUser()
  const { projects, isLoading, isError, error, retry } = useProjects()

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [preview, setPreview] = useState(null)
  const [toast, setToast] = useState(null)
  const [loggingOut, setLoggingOut] = useState(false)

  if (!isFirebaseConfigured) {
    return (
      <Gate>
        <StatePanel
          className="state-panel--error"
          icon={<AlertIcon size={22} />}
          title="Firebase is not configured"
          body="Add the VITE_FIREBASE_* variables to your .env file (see .env.example), then restart the dev server."
        />
      </Gate>
    )
  }

  if (loading) {
    return (
      <Gate full>
        <span className="admin-loading">
          <Spinner size={22} /> Checking credentials…
        </span>
      </Gate>
    )
  }

  //Unauthenticated visitors never see the dashboard.
  if (!user) {
    return <Navigate to="/admin/login" replace />
  }

  const showToast = (message) => {
    setToast(message)
    window.clearTimeout(showToast._t)
    showToast._t = window.setTimeout(() => setToast(null), 3500)
  }

  const openAdd = () => {
    setEditing(null)
    setFormOpen(true)
  }
  const openEdit = (project) => {
    setEditing(project)
    setFormOpen(true)
  }
  const handleSaved = (message) => {
    setFormOpen(false)
    setEditing(null)
    showToast(message)
  }
  const handleDeleted = (message) => {
    setDeleting(null)
    showToast(message)
  }
  const handleLogout = async () => {
    setLoggingOut(true)
    try {
      await logoutAdmin()
    } finally {
      setLoggingOut(false)
    }
  }

  const lastUpdated = projects.reduce(
    (latest, project) => Math.max(latest, project.updatedAt?.seconds ?? 0),
    0
  )

  return (
    <div className="admin-shell">
      <header className="admin-topbar">
        <div className="admin-topbar__inner">
          <div className="admin-topbar__brand">
            <span className="admin-topbar__mark" aria-hidden="true">
              ◆
            </span>
            <div>
              <p className="admin-topbar__name">Portfolio Admin</p>
              <p className="admin-topbar__user">{user.email}</p>
            </div>
          </div>
          <div className="admin-topbar__actions">
            <Link className="btn btn--neutral btn--sm" to="/" target="_blank">
              View site
            </Link>
            <button type="button" className="btn btn--neutral btn--sm" onClick={handleLogout} disabled={loggingOut}>
              {loggingOut ? <Spinner /> : <LogoutIcon />} Log out
            </button>
          </div>
        </div>
      </header>

      <main className="admin-main">
        <div className="container">
          <div className="admin-stats reveal-admin">
            <article className="admin-stat">
              <span className="admin-stat__value">{isLoading ? '…' : projects.length}</span>
              <span className="admin-stat__label">
                {projects.length === 1 ? 'Project' : 'Projects'}
              </span>
            </article>
            <article className="admin-stat">
              <span className="admin-stat__value admin-stat__value--time">
                {lastUpdated ? new Date(lastUpdated * 1000).toLocaleDateString() : '—'}
              </span>
              <span className="admin-stat__label">Last updated</span>
            </article>
          </div>

          <div className="admin-toolbar">
            <div>
              <h1 className="admin-heading">Projects</h1>
              <p className="admin-subheading">Manage what the world sees on your portfolio.</p>
            </div>
            <button type="button" className="btn btn--primary" onClick={openAdd}>
              <PlusIcon /> Add Project
            </button>
          </div>

          {isError ? (
            <StatePanel
              className="state-panel--error"
              icon={<AlertIcon size={24} />}
              title="Unable to load projects"
              body={error}
              action={
                <button type="button" className="btn btn--outline btn--sm" onClick={retry}>
                  <RefreshIcon /> Try again
                </button>
              }
            />
          ) : isLoading ? (
            <div className="admin-table" aria-busy="true">
              {[0, 1, 2].map((i) => (
                <div className="admin-table__row" key={i}>
                  <div className="skeleton admin-table__title" />
                  <div className="skeleton admin-table__meta" />
                  <div className="skeleton admin-table__actions" />
                </div>
              ))}
            </div>
          ) : projects.length === 0 ? (
            <StatePanel
              icon={<InboxIcon size={24} />}
              title="No projects yet"
              body="Start building your portfolio by adding your first project."
              action={
                <button type="button" className="btn btn--primary" onClick={openAdd}>
                  <PlusIcon /> Add Project
                </button>
              }
            />
          ) : (
            <div className="admin-table" role="table" aria-label="Projects">
              <div className="admin-table__head" role="row">
                <span role="columnheader">Project</span>
                <span role="columnheader">Technologies</span>
                <span role="columnheader">Actions</span>
              </div>
              <div className="admin-table__body" role="rowgroup">
                {projects.map((project) => (
                  <div className="admin-table__row" role="row" key={project.id}>
                    <div className="admin-cell admin-cell--main" role="cell">
                      <span className="admin-cell__title">{project.title}</span>
                      <span className="admin-cell__desc">{project.description}</span>
                    </div>
                    <div className="admin-cell" role="cell">
                      <div className="admin-cell__tags">
                        {Array.isArray(project.technologies) && project.technologies.length > 0 ? (
                          project.technologies.slice(0, 4).map((tech) => (
                            <span className="admin-tag" key={tech}>
                              {tech}
                            </span>
                          ))
                        ) : (
                          <span className="admin-cell__muted">—</span>
                        )}
                        {project.technologies?.length > 4 && (
                          <span className="admin-tag admin-tag--more">
                            +{project.technologies.length - 4}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="admin-cell admin-cell--actions" role="cell">
                      <button
                        type="button"
                        className="admin-action"
                        title="Preview"
                        aria-label={`Preview ${project.title}`}
                        onClick={() => setPreview(project)}
                      >
                        <EyeIcon />
                      </button>
                      <button
                        type="button"
                        className="admin-action"
                        title="Edit"
                        aria-label={`Edit ${project.title}`}
                        onClick={() => openEdit(project)}
                      >
                        <PencilIcon />
                      </button>
                      <button
                        type="button"
                        className="admin-action admin-action--danger"
                        title="Delete"
                        aria-label={`Delete ${project.title}`}
                        onClick={() => setDeleting(project)}
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Overlays */}
      {formOpen && (
        <ProjectForm project={editing} onClose={() => setFormOpen(false)} onSaved={handleSaved} />
      )}
      {deleting && (
        <ConfirmDialog project={deleting} onClose={() => setDeleting(null)} onDeleted={handleDeleted} />
      )}
      {preview && (
        <div
          className="admin-modal"
          role="dialog"
          aria-modal="true"
          aria-label={`Preview ${preview.title}`}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setPreview(null)
          }}
        >
          <div className="admin-modal__panel admin-modal__panel--preview">
            <header className="admin-modal__header">
              <p className="admin-modal__title">Public preview</p>
              <button
                type="button"
                className="admin-modal__close"
                aria-label="Close preview"
                onClick={() => setPreview(null)}
              >
                ✕
              </button>
            </header>
            <div className="admin-preview-slot">
              <ProjectCard project={preview} />
            </div>
          </div>
        </div>
      )}

      {toast && (
        <p className="admin-toast" role="status" aria-live="polite">
          {toast}
        </p>
      )}
    </div>
  )
}
function Gate({ children, full }) {
  return <div className={`admin-shell ${full ? 'admin-shell--center' : ''}`}>{children}</div>
}
