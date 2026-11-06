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
        <div className="stack-grid">
          {Object.entries(portfolio.skills).map(([category, skills], index) => (
            <div key={category} data-reveal>
              <span>0{index + 1}</span>
              <h3>{category}</h3>
              <ul>
                {skills.map((skill) => (
                  <li key={skill}>{skill}</li>
                ))}
              </ul>
            </div>
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
          <h2 id="experience-title" data-reveal>
            Evidence over embellishment.
          </h2>
        </div>
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

