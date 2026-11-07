import type { PanInfo } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

const AUTO_PLAY_DELAY = 5200;

const wrapIndex = (index: number, total: number) => {
  if (total === 0) return 0;
  return (index + total) % total;
};

export function useProjectCarousel(total: number) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [autoPlayEnabled, setAutoPlayEnabled] = useState(true);
  const [isInViewport, setIsInViewport] = useState(true);
  const viewportRef = useRef<HTMLDivElement>(null);

  const goToProject = useCallback(
    (index: number) => {
      setActiveIndex(wrapIndex(index, total));
    },
    [total],
  );

  const nextProject = useCallback(() => {
    goToProject(activeIndex + 1);
  }, [activeIndex, goToProject]);

  const previousProject = useCallback(() => {
    goToProject(activeIndex - 1);
  }, [activeIndex, goToProject]);

  const handleDragEnd = useCallback(
    (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      const viewportWidth = viewportRef.current?.clientWidth ?? 0;
      const threshold = Math.max(48, viewportWidth * 0.12);
      const movedEnough = Math.abs(info.offset.x) > threshold;
      const movingFast = Math.abs(info.velocity.x) > 500;

      if (movedEnough || movingFast) {
        goToProject(activeIndex + (info.offset.x < 0 ? 1 : -1));
      }
    },
    [activeIndex, goToProject],
  );

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsInViewport(entry.isIntersecting),
      { threshold: 0.2 },
    );
    observer.observe(viewport);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!autoPlayEnabled || !isInViewport || total < 2) return;

    const timer = window.setTimeout(() => {
      setActiveIndex((current) => wrapIndex(current + 1, total));
    }, AUTO_PLAY_DELAY);

    return () => window.clearTimeout(timer);
  }, [activeIndex, autoPlayEnabled, isInViewport, total]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "ArrowRight") {
        event.preventDefault();
        nextProject();
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        previousProject();
      }
      if (event.key === "Home") {
        event.preventDefault();
        goToProject(0);
      }
      if (event.key === "End") {
        event.preventDefault();
        goToProject(total - 1);
      }
    },
    [goToProject, nextProject, previousProject, total],
  );

  return {
    activeIndex,
    autoPlayEnabled,
    goToProject,
    handleDragEnd,
    handleKeyDown,
    nextProject,
    previousProject,
    toggleAutoPlay: () => setAutoPlayEnabled((enabled) => !enabled),
    viewportRef,
  };
}
