import type { CSSProperties } from "react";
import { ArrowUpRight } from "lucide-react";
import { getPublishedProjects, portfolio } from "@/data/portfolio";

const themeProjectAccents = [
  "var(--accent)",
  "var(--dusk-blue-light)",
  "var(--accent-soft)",
];

export function Projects() {
  const projects = getPublishedProjects(portfolio.projects);

  return (
    <section className="section projects" id="projects" aria-labelledby="projects-title">
      <div className="section-heading">
        <p className="section-index">02 / Selected work</p>
        <div>
          <h2 id="projects-title" data-reveal>
            Systems worth opening up.
          </h2>
          <p className="section-intro" data-reveal>
            Replace these marked samples with real work. Each case should show the problem,
            the engineering decision, and the outcome—not just the interface.
          </p>
        </div>
      </div>

      <div className="project-list">
        {projects.map((project, index) => (
          <article
            className="project-showcase"
            key={project.slug}
            style={{
              "--project-accent": themeProjectAccents[index % themeProjectAccents.length],
            } as CSSProperties}
            data-reveal
          >
            <div className="project-copy">
              <div className="project-kicker">
                <span>{project.index}</span>
                <span>{project.label}</span>
              </div>
              <h3>{project.title}</h3>
              <p>{project.summary}</p>
              <dl>
                <div>
                  <dt>Architecture</dt>
                  <dd>{project.architecture}</dd>
                </div>
                <div>
                  <dt>Stack</dt>
                  <dd>{project.stack.join(" · ")}</dd>
                </div>
              </dl>
              {project.demoUrl || project.repoUrl ? (
                <div className="project-actions">
                  {project.demoUrl ? (
                    <a href={project.demoUrl} target="_blank" rel="noreferrer">
                      Live demo <ArrowUpRight aria-hidden="true" size={16} />
                    </a>
                  ) : null}
                  {project.repoUrl ? (
                    <a href={project.repoUrl} target="_blank" rel="noreferrer">
                      Source code <ArrowUpRight aria-hidden="true" size={16} />
                    </a>
                  ) : null}
                </div>
              ) : (
                <p className="project-unconfigured">Links appear when configured</p>
              )}
            </div>

            <div className={`project-art project-art-${project.index}`} aria-hidden="true">
              <div className="art-window">
                <span />
                <span />
                <span />
                <div className="art-grid">
                  <i />
                  <i />
                  <i />
                  <i />
                  <i />
                  <i />
                </div>
              </div>
              <div className="art-label">CASE_{project.index}</div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

