import { profile } from '../data/profile'
import { GitHubIcon, LinkedinIcon, MailIcon, ExternalIcon } from './Icons'

export default function Contact() {
  const channels = [
    {
      label: 'Email',
      value: profile.email,
      href: `mailto:${profile.email}`,
      icon: <MailIcon />,
    },
    {
      label: 'LinkedIn',
      value: 'Open to connecting',
      href: profile.linkedin,
      icon: <LinkedinIcon />,
      external: true,
    },
    {
      label: 'GitHub',
      value: 'See the code',
      href: profile.github,
      icon: <GitHubIcon />,
      external: true,
    },
  ]

  return (
    <section id="contact" className="section contact" aria-label="Contact">
      <div className="container">
        <header className="section__header reveal">
          <p className="section__eyebrow">04 · Contact</p>
          <h2 className="section__title">Let's build something</h2>
          <p className="section__subtitle">
            Open to Software Engineer roles, internships, and interesting
            problems. My inbox is always open.
          </p>
        </header>

        <div className="contact__grid">
          {channels.map((channel, index) => (
            <a
              className="contact__card reveal"
              style={{ '--stagger': index }}
              key={channel.label}
              href={channel.href}
              {...(channel.external
                ? { target: '_blank', rel: 'noopener noreferrer' }
                : {})}
            >
              <span className="contact__icon" aria-hidden="true">
                {channel.icon}
              </span>
              <span className="contact__copy">
                <span className="contact__label">{channel.label}</span>
                <span className="contact__value">{channel.value}</span>
              </span>
              <span className="contact__arrow" aria-hidden="true">
                <ExternalIcon />
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
