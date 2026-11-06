"use client";

import type { CSSProperties } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import type { Project } from "@/types/portfolio";

type ProjectCarouselProps = {
  projects: Project[];
};

const springTransition = {
  type: "spring" as const,
  stiffness: 150,
  damping: 24,
  mass: 0.85,
};

export function ProjectCarousel({ projects }: ProjectCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<Array<HTMLElement | null>>([]);
  const scrollFrame = useRef<number | null>(null);
  const total = projects.length;

  const updateActiveProject = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;

    const trackCenter = track.scrollLeft + track.clientWidth / 2;
    let closestIndex = 0;
    let closestDistance = Number.POSITIVE_INFINITY;

    slideRefs.current.forEach((slide, index) => {
      if (!slide) return;
      const slideCenter = slide.offsetLeft + slide.clientWidth / 2;
      const distance = Math.abs(slideCenter - trackCenter);

      if (distance < closestDistance) {
        closestIndex = index;
        closestDistance = distance;
      }
    });

    setActiveIndex(closestIndex);
  }, []);

  const handleScroll = useCallback(() => {
    if (scrollFrame.current !== null) {
      window.cancelAnimationFrame(scrollFrame.current);
    }

    scrollFrame.current = window.requestAnimationFrame(updateActiveProject);
  }, [updateActiveProject]);

  useEffect(
    () => () => {
      if (scrollFrame.current !== null) {
        window.cancelAnimationFrame(scrollFrame.current);
      }
    },
    [],
  );

  const goToProject = useCallback(
    (index: number) => {
      const nextIndex = Math.max(0, Math.min(index, total - 1));
      const track = trackRef.current;
      const slide = slideRefs.current[nextIndex];
      setActiveIndex(nextIndex);

      if (!track || !slide) return;
      const centeredLeft =
        slide.offsetLeft - (track.clientWidth - slide.clientWidth) / 2;
      const maxScroll = Math.max(0, track.scrollWidth - track.clientWidth);
      track.scrollTo({
        behavior: "smooth",
        left: Math.min(Math.max(0, centeredLeft), maxScroll),
      });
    },
    [total],
  );

  if (total === 0) return null;

  return (
    <div className="project-carousel">
      <div className="project-carousel-toolbar">
        <p className="project-carousel-counter" aria-live="polite">
          {String(activeIndex + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </p>

        <div
          className="project-carousel-progress"
          role="group"
          aria-label="Choose a project"
        >
          {projects.map((project, index) => (
            <button
              key={project.slug}
              type="button"
              className={index === activeIndex ? "is-active" : undefined}
              aria-label={`View project ${index + 1}: ${project.title}`}
              aria-current={index === activeIndex ? "true" : undefined}
              onClick={() => goToProject(index)}
            >
              <span />
            </button>
          ))}
        </div>

        <div className="project-carousel-buttons">
          <button
            type="button"
            aria-label="Previous project"
            disabled={activeIndex === 0}
            onClick={() => goToProject(activeIndex - 1)}
          >
            <ArrowLeft aria-hidden="true" size={19} />
          </button>
          <button
            type="button"
            aria-label="Next project"
            disabled={activeIndex === total - 1}
            onClick={() => goToProject(activeIndex + 1)}
          >
            <ArrowRight aria-hidden="true" size={19} />
          </button>
        </div>
      </div>

      <div
        ref={trackRef}
        className="project-carousel-track"
        role="region"
        aria-roledescription="carousel"
        aria-label="Selected projects"
        onScroll={handleScroll}
      >
        {projects.map((project, index) => (
          <motion.article
            key={project.slug}
            ref={(element) => {
              slideRefs.current[index] = element;
            }}
            className="project-slide"
            role="group"
            aria-roledescription="slide"
            aria-label={`Project ${index + 1} of ${total}: ${project.title}`}
            style={{ "--project-accent": project.accent } as CSSProperties}
            initial={{ opacity: 0.42, scale: 0.94, y: 42 }}
            animate={{
              opacity: index === activeIndex ? 1 : 0.55,
              scale: index === activeIndex ? 1 : 0.965,
              y: index === activeIndex ? 0 : 14,
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
                  sizes="(max-width: 760px) 94vw, (max-width: 1500px) 86vw, 1376px"
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
        ))}
      </div>
    </div>
  );
}
