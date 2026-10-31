import { profile } from '../data/profile'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <p className="footer__name">{profile.name}</p>
        <p className="footer__note">
          Designed &amp; built with React + Firebase · {new Date().getFullYear()}
        </p>
        <div className="footer__links">
          <a href={profile.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
            GitHub
          </a>
          <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            LinkedIn
          </a>
          <a href={`mailto:${profile.email}`} aria-label="Email">
            Email
          </a>
        </div>
      </div>
    </footer>
  )
}
