import ProjectCard from './ProjectCard'
import StatePanel from './StatePanel'
import { InboxIcon, AlertIcon, RefreshIcon, Spinner } from './Icons'

/**
 * Public projects section.
 * Data flows exclusively from Firestore:
 *
 *   Firestore ──▶ useProjects ──▶ Projects ──▶ ProjectCard
 *
 * Handles loading (skeletons), error and empty states.
 */
export default function Projects({ projects, isLoading, isError, error, onRetry }) {
  return (
    <section id="projects" className="section projects" aria-label="Projects">
      <div className="container">
        <header className="section__header reveal">
          <p className="section__eyebrow">05 · Work</p>
          <h2 className="section__title">Projects</h2>
          <p className="section__subtitle">
            Things I've designed, built, and shipped — stored live in the cloud.
          </p>
        </header>

        {isError ? (
          <StatePanel
            className="state-panel--error"
            icon={<AlertIcon size={24} />}
            title="Unable to load projects"
            body={error ?? 'Please try again later.'}
            action={
              <button type="button" className="btn btn--outline" onClick={onRetry}>
                <RefreshIcon /> Try again
              </button>
            }
          />
        ) : isLoading ? (
          <div className="projects__grid" aria-busy="true" aria-live="polite">
            {[0, 1, 2].map((i) => <SkeletonCard key={i} delay={i} />)}
            <p className="sr-only">
              <Spinner /> Loading projects…
            </p>
          </div>
        ) : projects.length === 0 ? (
          <StatePanel
            icon={<InboxIcon size={24} />}
            title="No projects available yet"
            body="Check back soon."
          />
        ) : (
          <div className="projects__grid">
            {projects.map((project, index) => (
              <div
                className="projects__cell"
                style={{ '--stagger': index % 3 }}
                key={project.id}
              >
                <ProjectCard project={project} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

function SkeletonCard({ delay }) {
  return (
    <div className="project-card skeleton-card" style={{ '--stagger': delay }} aria-hidden="true">
      <div className="skeleton skeleton-card__title" />
      <div className="skeleton skeleton-card__line" />
      <div className="skeleton skeleton-card__line skeleton-card__line--short" />
      <div className="skeleton-card__badges">
        <div className="skeleton skeleton-card__badge" />
        <div className="skeleton skeleton-card__badge" />
        <div className="skeleton skeleton-card__badge" />
      </div>
      <div className="skeleton-card__buttons">
        <div className="skeleton skeleton-card__btn" />
        <div className="skeleton skeleton-card__btn" />
      </div>
    </div>
  )
}
