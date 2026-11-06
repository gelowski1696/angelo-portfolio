import { ArrowDownRight } from "lucide-react";
import { getPublishedProjects, portfolio } from "@/data/portfolio";

export default function Home() {
  const projects = getPublishedProjects(portfolio.projects);

  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="Go to the top">
          &lt;{portfolio.name} /&gt;
        </a>
        <nav aria-label="Primary navigation">
          <a href="#about">About</a>
          <a href="#projects">Projects</a>
          <a href="#stack">Stack</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      <main id="main-content">
        <section className="hero" id="top" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow">{portfolio.eyebrow}</p>
            <h1 id="hero-title">{portfolio.tagline}</h1>
            <p className="hero-role">{portfolio.role}</p>
            <div className="hero-actions">
              <a className="button button-primary" href="#projects">
                Explore projects <ArrowDownRight aria-hidden="true" size={18} />
              </a>
              <a className="button button-quiet" href="#contact">
                Start a conversation
              </a>
            </div>
          </div>
          <div className="hero-visual" aria-hidden="true">
            <div className="core-shell">
              <div className="core-screen">
                <span>SYS/PORTFOLIO</span>
                <strong>READY</strong>
              </div>
            </div>
          </div>
          <p className="scroll-cue">Scroll to inspect the system</p>
        </section>

        <section className="section intro" id="about" aria-labelledby="about-title">
          <p className="section-index">01 / Profile</p>
          <div>
            <h2 id="about-title">Engineering with clarity, character, and consequence.</h2>
            <p className="lede">{portfolio.introduction}</p>
          </div>
        </section>

        <section className="section projects" id="projects" aria-labelledby="projects-title">
          <div className="section-heading">
            <p className="section-index">02 / Selected work</p>
            <h2 id="projects-title">Systems worth opening up.</h2>
          </div>
          <div className="project-list">
            {projects.map((project) => (
              <article className="project-row" key={project.slug}>
                <span className="project-index">{project.index}</span>
                <div>
                  <p className="project-label">{project.label}</p>
                  <h3>{project.title}</h3>
                  <p>{project.summary}</p>
                </div>
                <ul aria-label={`${project.title} technologies`}>
                  {project.stack.map((technology) => (
                    <li key={technology}>{technology}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="section stack" id="stack" aria-labelledby="stack-title">
          <div className="section-heading">
            <p className="section-index">03 / Capabilities</p>
            <h2 id="stack-title">A connected technical practice.</h2>
          </div>
          <div className="stack-grid">
            {Object.entries(portfolio.skills).map(([category, skills]) => (
              <div key={category}>
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

        <section className="contact" id="contact" aria-labelledby="contact-title">
          <p className="section-index">04 / Contact</p>
          <h2 id="contact-title">Let’s build something remarkable.</h2>
          <p>Configure your real email and social links in the portfolio data file to activate contact actions.</p>
        </section>
      </main>

      <footer>
        <span>© {new Date().getFullYear()} {portfolio.name}</span>
        <a href="#top">Back to top</a>
      </footer>
    </>
  );
}

