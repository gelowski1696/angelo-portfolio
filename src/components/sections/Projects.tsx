import { getPublishedProjects, portfolio } from "@/data/portfolio";
import { ProjectCarousel } from "./ProjectCarousel";

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

      <ProjectCarousel projects={projects} />
    </section>
  );
}
