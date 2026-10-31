import { GitHubIcon, ExternalIcon } from './Icons'

/**
 * Project presentation card.
 * Used on the public portfolio AND as the admin "Preview" —
 * the single shared presentation of a project document.
 */
export default function ProjectCard({ project }) {
  const { title, description, githubUrl, liveUrl, technologies = [] } = project

  return (
    <article className="project-card" tabIndex={0}>
      <div className="project-card__body">
        <h3 className="project-card__title">{title}</h3>
        <p className="project-card__desc">{description}</p>
      </div>

      {technologies.length > 0 && (
        <ul className="project-card__tech" aria-label="Technologies used">
          {technologies.map((tech) => (
            <li className="badge" key={tech}>
              {tech}
            </li>
          ))}
        </ul>
      )}

      <div className="project-card__actions">
        <a
          className="btn btn--outline btn--sm"
          href={githubUrl || undefined}
          target="_blank"
          rel="noopener noreferrer"
          aria-disabled={!githubUrl}
          aria-label={`GitHub repository of ${title}`}
          onClick={(event) => {
            if (!githubUrl) event.preventDefault()
          }}
        >
          <GitHubIcon /> GitHub
        </a>
        <a
          className="btn btn--primary btn--sm"
          href={liveUrl || undefined}
          target="_blank"
          rel="noopener noreferrer"
          aria-disabled={!liveUrl}
          aria-label={`Live demo of ${title}`}
          onClick={(event) => {
            if (!liveUrl) event.preventDefault()
          }}
        >
          <ExternalIcon /> Live Demo
        </a>
      </div>
    </article>
  )
}
