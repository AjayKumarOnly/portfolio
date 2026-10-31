import { skillGroups } from '../data/profile'

export default function Skills() {
  return (
    <section id="skills" className="section skills" aria-label="Technical skills">
      <div className="container">
        <header className="section__header reveal">
          <p className="section__eyebrow">02 · Tech Stack</p>
          <h2 className="section__title">Skills &amp; technologies</h2>
          <p className="section__subtitle">
            The tools I use to design, build, and ship software.
          </p>
        </header>

        <div className="skills__grid">
          {skillGroups.map((group, index) => (
            <article
              className="skills__card reveal"
              style={{ '--stagger': index }}
              key={group.title}
            >
              <h3 className="skills__title">{group.title}</h3>
              <ul className="skills__badges">
                {group.skills.map((skill) => (
                  <li className="badge" key={skill}>
                    {skill}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
