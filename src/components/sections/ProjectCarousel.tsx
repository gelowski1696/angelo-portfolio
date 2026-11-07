"use client";

import { ArrowLeft, ArrowRight, Pause, Play } from "lucide-react";
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
    finishPointerDrag,
    goToProject,
    handlePointerDown,
    handlePointerMove,
    handleScroll,
    isDragging,
    preventDraggedClick,
    registerSlide,
    setIsHovering,
    toggleAutoPlay,
    trackRef,
  } = useProjectCarousel(total);

  if (total === 0) return null;

  return (
    <div
      className="project-carousel"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <ProjectMotionBackground />

      <div className="project-carousel-toolbar">
        <p
          className="project-carousel-counter"
          aria-live={autoPlayEnabled ? "off" : "polite"}
        >
          {String(activeIndex + 1).padStart(2, "0")} /{" "}
          {String(total).padStart(2, "0")}
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
        className={`project-carousel-track${isDragging ? " is-dragging" : ""}`}
        role="region"
        aria-roledescription="carousel"
        aria-label="Selected projects"
        onClickCapture={preventDraggedClick}
        onPointerCancel={finishPointerDrag}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={finishPointerDrag}
        onScroll={handleScroll}
      >
        {projects.map((project, index) => (
          <ProjectSlide
            key={project.slug}
            active={index === activeIndex}
            index={index}
            project={project}
            register={(element) => registerSlide(index, element)}
            total={total}
          />
        ))}
      </div>
    </div>
  );
}
