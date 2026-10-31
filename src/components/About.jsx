import { profile, aboutShort, aboutSections, facts, stats } from '../data/profile'

export default function About() {
  return (
    <section id="about" className="section about" aria-label="About me">
      <div className="container">
        <header className="section__header reveal">
          <p className="section__eyebrow">01 · About</p>
          <h2 className="section__title">A little about me</h2>
        </header>

        <div className="about__grid">
          <div className="reveal" style={{ '--stagger': 1 }}>
            <p className="about__lead">{aboutShort}</p>
            {aboutSections.map((block) => (
              <div className="about__block" key={block.heading}>
                <h3 className="about__heading">{block.heading}</h3>
                <ul className="about__list">
                  {block.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <aside className="about__aside reveal" style={{ '--stagger': 2 }}>
            <div className="about__facts">
              {facts.map((fact) => (
                <div className="about__fact" key={fact.label}>
                  <span className="about__fact-label">{fact.label}</span>
                  <span className="about__fact-value">{fact.value}</span>
                </div>
              ))}
            </div>
            <div className="about__stats" role="list">
              {stats.map((stat) => (
                <div className="about__stat" role="listitem" key={stat.label}>
                  <span className="about__stat-value">{stat.value}</span>
                  <span className="about__stat-label">{stat.label}</span>
                </div>
              ))}
            </div>
            <a className="btn btn--outline about__cta" href={`mailto:${profile.email}`}>
              Get in touch
            </a>
          </aside>
        </div>
      </div>
    </section>
  )
}
