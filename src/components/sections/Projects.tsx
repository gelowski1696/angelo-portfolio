import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { getPublishedProjects, portfolio } from "@/data/portfolio";
import { AnimatedProject } from "@/components/motion/AnimatedProject";

export function Projects() {
  const projects = getPublishedProjects(portfolio.projects);

  return (
    <section className="section projects" id="projects" aria-labelledby="projects-title">
      <div className="section-heading">
        <p className="section-index">02 / Selected work</p>
        <div>
          <h2 id="projects-title" data-reveal>
            Systems and sites worth opening up.
          </h2>
          <p className="section-intro" data-reveal>
            Production platforms and focused digital experiences shaped around
            real operational goals—from resilient business systems to expressive,
            conversion-ready websites.
          </p>
        </div>
      </div>

      <div className="project-list">
        {projects.map((project) => (
          <AnimatedProject
            key={project.slug}
            accent={project.accent}
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
                      Visit platform <ArrowUpRight aria-hidden="true" size={16} />
                    </a>
                  ) : null}
                  {project.repoUrl ? (
                    <a href={project.repoUrl} target="_blank" rel="noreferrer">
                      Source code <ArrowUpRight aria-hidden="true" size={16} />
                    </a>
                  ) : null}
                </div>
              ) : (
                <p className="project-unconfigured">
                  {project.linkNote ?? "Public links are not available"}
                </p>
              )}
              {project.linkNote && (project.demoUrl || project.repoUrl) ? (
                <p className="project-unconfigured">{project.linkNote}</p>
              ) : null}
            </div>

            <div
              className={`project-art project-art-${project.index}${project.image ? " has-image" : ""}`}
              aria-hidden="true"
            >
              {project.image ? (
                <Image
                  className="project-art-image"
                  src={project.image}
                  alt=""
                  fill
                  sizes="(max-width: 900px) 100vw, 58vw"
                />
              ) : (
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
              )}
              <div className="art-label">CASE_{project.index}</div>
            </div>
          </AnimatedProject>
        ))}
      </div>
    </section>
  );
}

