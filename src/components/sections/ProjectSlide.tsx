import type { CSSProperties } from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import type { Project } from "@/types/portfolio";

type ProjectSlideProps = {
  active: boolean;
  index: number;
  project: Project;
  register: (element: HTMLElement | null) => void;
  total: number;
};

const springTransition = {
  type: "spring" as const,
  stiffness: 150,
  damping: 24,
  mass: 0.85,
};

export function ProjectSlide({
  active,
  index,
  project,
  register,
  total,
}: ProjectSlideProps) {
  return (
    <motion.article
      ref={register}
      className="project-slide"
      role="group"
      aria-roledescription="slide"
      aria-label={`Project ${index + 1} of ${total}: ${project.title}`}
      style={{ "--project-accent": project.accent } as CSSProperties}
      initial={{ opacity: 0.42, scale: 0.94, y: 42 }}
      animate={{
        opacity: active ? 1 : 0.55,
        scale: active ? 1 : 0.965,
        y: active ? 0 : 14,
      }}
      transition={springTransition}
    >
      <figure className="project-art">
        {project.image ? (
          <Image
            className="project-art-image"
            src={project.image}
            alt={`${project.title} landing page`}
            fill
            sizes="(max-width: 760px) 92vw, (max-width: 1200px) 78vw, 1024px"
          />
        ) : (
          <div className="project-art-placeholder" aria-hidden="true">
            <span>CASE_{project.index}</span>
          </div>
        )}
        <figcaption>
          <span>CASE_{project.index}</span>
          <span>Full landing page view</span>
        </figcaption>
      </figure>

      <div className="project-copy">
        <div className="project-copy-main">
          <div className="project-kicker">
            <span>{project.index}</span>
            <span>{project.label}</span>
          </div>
          <h3>{project.title}</h3>
          <p>{project.summary}</p>
        </div>

        <div className="project-copy-meta">
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
      </div>
    </motion.article>
  );
}
