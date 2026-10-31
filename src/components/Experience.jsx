import { experience, education } from '../data/profile'

function Timeline({ title, items }) {
  return (
    <div className="timeline__group reveal">
      <h3 className="timeline__group-title">{title}</h3>
      <ol className="timeline__list">
        {items.map((item) => (
          <li className="timeline__item" key={`${item.org}-${item.role}`}>
            <div className="timeline__marker" aria-hidden="true" />
            <div className="timeline__content">
              <span className="timeline__period">{item.period}</span>
              <h4 className="timeline__role">{item.role}</h4>
              <p className="timeline__org">{item.org}</p>
              <p className="timeline__desc">{item.description}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}

export default function Experience() {
  return (
    <section id="experience" className="section experience" aria-label="Experience and education">
      <div className="container">
        <header className="section__header reveal">
          <p className="section__eyebrow">03 · Journey</p>
          <h2 className="section__title">Experience &amp; education</h2>
        </header>

        <div className="timeline__grid">
          <Timeline title="Experience" items={experience} />
          <Timeline title="Education" items={education} />
        </div>
      </div>
    </section>
  )
}
