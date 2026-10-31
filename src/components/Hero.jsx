import { profile, heroIntro, heroTechStrip } from '../data/profile'
import { GitHubIcon, ArrowIcon } from './Icons'

/**
 * Hero section — first impression.
 * Subtle technical background: CSS grid pattern, faint glow,
 * floating particles (pure CSS, transform/opacity only).
 */
export default function Hero() {
  return (
    <section id="home" className="hero" aria-label="Introduction">
      <div className="hero__bg" aria-hidden="true">
        <div className="hero__grid" />
        <div className="hero__glow" />
        <span className="hero__particle hero__particle--1" />
        <span className="hero__particle hero__particle--2" />
        <span className="hero__particle hero__particle--3" />
      </div>

      <div className="container hero__inner">
        <p className="hero__eyebrow hero-anim" style={{ '--stagger': 0 }}>
          <span className="hero__prompt">&lt;/&gt;</span> Hello world, I'm
        </p>

        <h1 className="hero__title hero-anim" style={{ '--stagger': 1 }}>
          {profile.name === '[YOUR NAME]' ? 'Your Name' : profile.name}
        </h1>

        <p className="hero__role hero-anim" style={{ '--stagger': 2 }}>
          Software Engineer
        </p>

        <p className="hero__intro hero-anim" style={{ '--stagger': 3 }}>
          {heroIntro}
        </p>

        <div className="hero__actions hero-anim" style={{ '--stagger': 4 }}>
          <a href="#projects" className="btn btn--primary">
            View Projects <ArrowIcon />
          </a>
          <a
            href={profile.github}
            className="btn btn--outline"
            target="_blank"
            rel="noopener noreferrer"
          >
            <GitHubIcon /> GitHub
          </a>
          <a
            href={profile.email ? `mailto:${profile.email}` : '#contact'}
            className="btn btn--ghost"
          >
            Contact Me
          </a>
        </div>

        <div className="hero__strip hero-anim" style={{ '--stagger': 5 }} aria-hidden="true">
          <div className="hero__strip-track">
            {[0, 1].map((copy) => (
              <span key={copy} className="hero__strip-items">
                {heroTechStrip.join(' · ').concat(' · ')}
              </span>
            ))}
          </div>
        </div>
      </div>

      <a className="hero__scroll" href="#about" aria-label="Scroll to About section">
        <span className="hero__scroll-line" aria-hidden="true" />
      </a>
    </section>
  )
}
