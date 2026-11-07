import { portfolio } from "@/data/portfolio";

export function StackExperience() {
  return (
    <>
      <section className="section stack" id="stack" aria-labelledby="stack-title">
        <div className="section-heading">
          <p className="section-index">03 / Capabilities</p>
          <div>
            <h2 id="stack-title" data-reveal>
              A connected technical practice.
            </h2>
            <p className="section-intro" data-reveal>
              A practical stack spanning the interface, API, data, and delivery layers
              needed to ship and support business software.
            </p>
          </div>
        </div>
        <div className="capability-list">
          {Object.entries(portfolio.skills).map(([category, skills], index) => (
            <article key={category} data-reveal>
              <span className="capability-index">0{index + 1}</span>
              <div className="capability-copy">
                <h3>{category}</h3>
                <p>{portfolio.capabilityNotes[category]}</p>
              </div>
              <ul>
                {skills.map((skill) => (
                  <li key={skill}>{skill}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section
        className="section experience"
        id="experience"
        aria-labelledby="experience-title"
      >
        <div className="section-heading">
          <p className="section-index">04 / Experience</p>
          <div>
            <h2 id="experience-title" data-reveal>
              Evidence over embellishment.
            </h2>
            <p className="section-intro" data-reveal>
              A progression from frontline technical support to owning the systems,
              interfaces, and production decisions behind business software.
            </p>
          </div>
        </div>
        <dl className="experience-register" data-reveal>
          <div>
            <dt>Professional practice</dt>
            <dd>5+ years</dd>
          </div>
          <div>
            <dt>Current scope</dt>
            <dd>ERP / POS + independent products</dd>
          </div>
          <div>
            <dt>Operating mode</dt>
            <dd>Build / ship / support</dd>
          </div>
        </dl>
        {portfolio.experience.length ? (
          <ol className="timeline">
            {portfolio.experience.map((item) => (
              <li key={`${item.period}-${item.role}`} data-reveal>
                <span>{item.period}</span>
                <div>
                  <p className="experience-organization">{item.organization}</p>
                  <h3>{item.role}</h3>
                  <p className="experience-summary">{item.summary}</p>
                </div>
                <ul className="experience-focus" aria-label={`${item.role} focus areas`}>
                  {item.focus.map((focus) => (
                    <li key={focus}>{focus}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        ) : (
          <div className="experience-empty" data-reveal>
            <span>DATA_PENDING</span>
            <div>
              <h3>Your real experience belongs here.</h3>
              <p>
                Add roles, dates, and specific outcomes to the typed portfolio file. No
                fictional companies or metrics are published by default.
              </p>
            </div>
          </div>
        )}
      </section>
    </>
  );
}

