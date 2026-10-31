import { useState } from 'react'
import { addProject, updateProject } from '../firebase/firestore'
import { CloseIcon, CloseIcon as XIcon, Spinner, AlertIcon, PlusIcon } from '../components/Icons'

const EMPTY = {
  title: '',
  description: '',
  githubUrl: '',
  liveUrl: '',
  technologies: [],
}

/**
 * Add / Edit project form in a modal.
 *
 * Data flow:
 *   Validate ▸ Firestore write (await server ack) ▸ close ▸ toast
 * The modal never reports success before Firestore confirms it,
 * and never swallows failures.
 */
export default function ProjectForm({ project, onClose, onSaved }) {
  const editing = Boolean(project?.id)
  const [values, setValues] = useState(
    editing
      ? {
          title: project.title ?? '',
          description: project.description ?? '',
          githubUrl: project.githubUrl ?? '',
          liveUrl: project.liveUrl ?? '',
          technologies: Array.isArray(project.technologies) ? project.technologies : [],
        }
      : EMPTY
  )
  const [techInput, setTechInput] = useState('')
  const [errors, setErrors] = useState({})
  const [saveError, setSaveError] = useState(null)
  const [saving, setSaving] = useState(false)

  const setField = (name, value) => {
    setValues((current) => ({ ...current, [name]: value }))
    setErrors((current) => (current[name] ? { ...current, [name]: undefined } : current))
  }

  /** Add technology chips (Enter, comma, or Tab) —
   *  pasting "Java, Spring Boot, JWT" creates 3 separate chips. */
  const commitTech = (raw) => {
    const values = raw
      .split(/[\n,]+/)
      .map((value) => value.trim())
      .filter(Boolean)
    if (values.length === 0) return
    setValues((current) => {
      const merged = [...current.technologies]
      for (const value of values) {
        if (!merged.some((tech) => tech.toLowerCase() === value.toLowerCase())) {
          merged.push(value)
        }
      }
      return { ...current, technologies: merged }
    })
    setTechInput('')
    setErrors((current) => ({ ...current, technologies: undefined }))
  }

  const removeTech = (tech) => {
    setValues((current) => ({
      ...current,
      technologies: current.technologies.filter((existing) => existing !== tech),
    }))
  }

  /** Full client-side validation before anything hits Firestore. */
  const validate = () => {
    const next = {}
    if (!values.title.trim()) {
      next.title = 'Title is required.'
    } else if (values.title.trim().length < 2) {
      next.title = 'Title must be at least 2 characters.'
    }
    if (!values.description.trim()) {
      next.description = 'Description is required.'
    } else if (values.description.trim().length < 10) {
      next.description = 'Write at least a sentence (10+ characters).'
    }
    if (!values.githubUrl.trim()) {
      next.githubUrl = 'GitHub URL is required.'
    } else if (!isValidUrl(values.githubUrl)) {
      next.githubUrl = 'Enter a valid URL, e.g. https://github.com/user/repo'
    }
    if (values.liveUrl.trim() && !isValidUrl(values.liveUrl)) {
      next.liveUrl = 'Enter a valid URL, e.g. https://project.example.com'
    }
    if (values.technologies.length === 0) {
      next.technologies = 'Add at least one technology.'
    } else if (values.technologies.some((tech) => tech.length > 28)) {
      next.technologies =
        'Keep each technology under 28 characters. Long comma-separated lists are split automatically — remove the unwanted chips.'
    }
    setErrors(next)
    return Object.values(next).every((message) => !message)
  }

  const onSubmit = async (event) => {
    event.preventDefault()
    setSaveError(null)
    if (!validate()) return

    setSaving(true)
    try {
      if (editing) {
        await updateProject(project.id, values)
      } else {
        await addProject(values)
      }
      // Firestore confirmed the write — only now do we update UI.
      onSaved(editing ? 'Project updated.' : 'Project added.')
    } catch (writeError) {
      setSaveError(writeError.message)
      setSaving(false)
    }
  }

  return (
    <div
      className="admin-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-form-heading"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div className="admin-modal__panel admin-modal__panel--wide">
        <header className="admin-modal__header">
          <h2 className="admin-modal__title" id="project-form-heading">
            {editing ? 'Edit project' : 'Add project'}
          </h2>
          <button type="button" className="admin-modal__close" aria-label="Close" onClick={onClose}>
            <CloseIcon />
          </button>
        </header>

        <form className="admin-form" onSubmit={onSubmit} noValidate>
          {/* Title */}
          <div className="admin-form__field">
            <label className="admin-form__label" htmlFor="project-title">
              Project Title <span className="admin-form__req">*</span>
            </label>
            <input
              className={`admin-form__input ${errors.title ? 'is-invalid' : ''}`}
              id="project-title"
              type="text"
              placeholder="e.g. RockNet"
              value={values.title}
              onChange={(event) => setField('title', event.target.value)}
            />
            <FieldError message={errors.title} />
          </div>

          {/* Description */}
          <div className="admin-form__field">
            <label className="admin-form__label" htmlFor="project-description">
              Description <span className="admin-form__req">*</span>
            </label>
            <textarea
              className={`admin-form__input admin-form__input--area ${errors.description ? 'is-invalid' : ''}`}
              id="project-description"
              rows={4}
              maxLength={500}
              placeholder="What is it? Why does it matter?"
              value={values.description}
              onChange={(event) => setField('description', event.target.value)}
            />
            <FieldError message={errors.description} />
          </div>

          {/* URLs */}
          <div className="admin-form__grid">
            <div className="admin-form__field">
              <label className="admin-form__label" htmlFor="project-github">
                GitHub URL <span className="admin-form__req">*</span>
              </label>
              <input
                className={`admin-form__input ${errors.githubUrl ? 'is-invalid' : ''}`}
                id="project-github"
                type="url"
                placeholder="https://github.com/user/repo"
                value={values.githubUrl}
                onChange={(event) => setField('githubUrl', event.target.value)}
              />
              <FieldError message={errors.githubUrl} />
            </div>
            <div className="admin-form__field">
              <label className="admin-form__label" htmlFor="project-live">
                Live Website URL <span className="admin-form__opt">(optional)</span>
              </label>
              <input
                className={`admin-form__input ${errors.liveUrl ? 'is-invalid' : ''}`}
                id="project-live"
                type="url"
                placeholder="https://project.example.com"
                value={values.liveUrl}
                onChange={(event) => setField('liveUrl', event.target.value)}
              />
              <FieldError message={errors.liveUrl} />
            </div>
          </div>

          {/* Technologies */}
          <div className="admin-form__field">
            <label className="admin-form__label" htmlFor="project-tech">
              Technologies <span className="admin-form__req">*</span>
            </label>
            <div
              className={`admin-form__tags ${errors.technologies ? 'is-invalid' : ''}`}
              onClick={(event) => event.currentTarget.querySelector('input')?.focus()}
            >
              <ul className="admin-form__chips">
                {values.technologies.map((tech) => (
                  <li className="admin-chip" key={tech}>
                    {tech}
                    <button
                      type="button"
                      className="admin-chip__remove"
                      aria-label={`Remove ${tech}`}
                      onClick={() => removeTech(tech)}
                    >
                      <XIcon size={12} />
                    </button>
                  </li>
                ))}
                <li className="admin-form__chip-input">
                  <input
                    id="project-tech"
                    type="text"
                    placeholder={values.technologies.length ? 'Add another…' : 'e.g. React · Spring Boot · PostgreSQL'}
                    value={techInput}
                    onChange={(event) => setTechInput(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ',' || event.key === 'Tab') {
                        if (event.key !== 'Tab' || techInput.trim()) {
                          event.preventDefault()
                          commitTech(techInput)
                        }
                      } else if (event.key === 'Backspace' && !techInput && values.technologies.length) {
                        removeTech(values.technologies[values.technologies.length - 1])
                      }
                    }}
                    onBlur={() => commitTech(techInput)}
                  />
                </li>
              </ul>
            </div>
            <FieldError message={errors.technologies} />
            <p className="admin-form__hint">Press Enter or comma to add. Example: React, Spring Boot, PostgreSQL, Docker.</p>
          </div>

          {saveError && (
            <p className="admin-form__error" role="alert">
              <AlertIcon size={14} /> {saveError}
            </p>
          )}

          <footer className="admin-modal__footer">
            <button type="button" className="btn btn--neutral" onClick={onClose} disabled={saving}>
              Cancel
            </button>
            <button type="submit" className="btn btn--primary" disabled={saving}>
              {saving ? (
                <>
                  <Spinner /> Saving to Firestore…
                </>
              ) : (
                <>
                  <PlusIcon />
                  {editing ? 'Save changes' : 'Add Project'}
                </>
              )}
            </button>
          </footer>
        </form>
      </div>
    </div>
  )
}

function FieldError({ message }) {
  if (!message) return null
  return (
    <p className="admin-form__field-error" role="alert">
      {message}
    </p>
  )
}

function isValidUrl(value) {
  try {
    const url = new URL(value.trim())
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}
