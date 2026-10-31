/**
 * Shared friendly empty / error / info panel used by the
 * portfolio and the admin dashboard.
 */
export default function StatePanel({ icon, title, body, action, className = '' }) {
  return (
    <div className={`state-panel ${className}`}>
      <span className="state-panel__icon" aria-hidden="true">
        {icon}
      </span>
      <h3 className="state-panel__title">{title}</h3>
      {body && <p className="state-panel__body">{body}</p>}
      {action && <div className="state-panel__action">{action}</div>}
    </div>
  )
}
