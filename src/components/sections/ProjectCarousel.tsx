"use client";

import { ArrowLeft, ArrowRight, Pause, Play } from "lucide-react";
import { motion } from "motion/react";
import type { CSSProperties } from "react";
import type { Project } from "@/types/portfolio";
import { ProjectMotionBackground } from "./ProjectMotionBackground";
import { ProjectSlide } from "./ProjectSlide";
import { useProjectCarousel } from "./use-project-carousel";

type ProjectCarouselProps = {
  projects: Project[];
};

export function ProjectCarousel({ projects }: ProjectCarouselProps) {
  const total = projects.length;
  const {
    activeIndex,
    autoPlayEnabled,
    goToProject,
    handleDragEnd,
    handleKeyDown,
    nextProject,
    previousProject,
    toggleAutoPlay,
    viewportRef,
  } = useProjectCarousel(total);

  if (total === 0) return null;

  return (
    <div
      className="project-carousel"
    >
      <ProjectMotionBackground />

      <div className="project-carousel-toolbar">
        <div className="project-carousel-heading">
          <p className="project-carousel-eyebrow">Selected work / case studies</p>
          <p className="project-carousel-counter" aria-live="polite">
            {String(activeIndex + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </p>
        </div>

        <p className="project-carousel-current" aria-live="polite">
          {projects[activeIndex]?.title}
        </p>

        <div className="project-carousel-progress" role="group" aria-label="Choose a project">
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
            aria-label={
              autoPlayEnabled
                ? "Pause project autoplay"
                : "Play project autoplay"
            }
            onClick={toggleAutoPlay}
          >
            {autoPlayEnabled ? (
              <Pause aria-hidden="true" size={17} />
            ) : (
              <Play aria-hidden="true" size={17} />
            )}
          </button>
          <button
            type="button"
            aria-label="Previous project"
            onClick={previousProject}
          >
            <ArrowLeft aria-hidden="true" size={19} />
          </button>
          <button
            type="button"
            aria-label="Next project"
            onClick={nextProject}
          >
            <ArrowRight aria-hidden="true" size={19} />
          </button>
        </div>
      </div>

      <div
        ref={viewportRef}
        className="project-carousel-viewport"
        role="region"
        aria-roledescription="carousel"
        aria-label="Selected projects"
        tabIndex={0}
        onKeyDown={handleKeyDown}
      >
        <motion.div
          className="project-carousel-track"
          style={{ "--project-count": total } as CSSProperties}
          animate={{ x: `-${(activeIndex * 100) / total}%` }}
          transition={{ type: "spring", stiffness: 260, damping: 32, mass: 0.9 }}
          drag="x"
          dragDirectionLock
          dragElastic={0.12}
          dragMomentum={false}
          onDragEnd={handleDragEnd}
        >
          {projects.map((project, index) => (
            <ProjectSlide
              key={project.slug}
              active={index === activeIndex}
              index={index}
              project={project}
              total={total}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
}
