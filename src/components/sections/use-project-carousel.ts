import type {
  MouseEvent as ReactMouseEvent,
  PointerEvent as ReactPointerEvent,
} from "react";
import { useCallback, useEffect, useRef, useState } from "react";

type DragState = {
  pointerId: number;
  startScrollLeft: number;
  startX: number;
};

const AUTO_PLAY_DELAY = 4500;

export function useProjectCarousel(total: number) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [autoPlayEnabled, setAutoPlayEnabled] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isInViewport, setIsInViewport] = useState(true);
  const trackRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<Array<HTMLElement | null>>([]);
  const scrollFrame = useRef<number | null>(null);
  const dragState = useRef<DragState | null>(null);
  const dragMoved = useRef(false);

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

  useEffect(() => {
    const track = trackRef.current;
    if (!track || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsInViewport(entry.isIntersecting),
      { threshold: 0.25 },
    );
    observer.observe(track);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (
      !autoPlayEnabled ||
      !isInViewport ||
      isDragging ||
      isHovering ||
      total < 2
    ) {
      return;
    }

    const timer = window.setTimeout(() => {
      goToProject((activeIndex + 1) % total);
    }, AUTO_PLAY_DELAY);

    return () => window.clearTimeout(timer);
  }, [activeIndex, autoPlayEnabled, goToProject, isDragging, isHovering, isInViewport, total]);

  useEffect(
    () => () => {
      if (scrollFrame.current !== null) {
        window.cancelAnimationFrame(scrollFrame.current);
      }
    },
    [],
  );

  const handleScroll = useCallback(() => {
    if (scrollFrame.current !== null) {
      window.cancelAnimationFrame(scrollFrame.current);
    }
    scrollFrame.current = window.requestAnimationFrame(updateActiveProject);
  }, [updateActiveProject]);

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;

    dragState.current = {
      pointerId: event.pointerId,
      startScrollLeft: event.currentTarget.scrollLeft,
      startX: event.clientX,
    };
    dragMoved.current = false;
    event.currentTarget.setPointerCapture?.(event.pointerId);
    setIsDragging(true);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragState.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    const distance = event.clientX - drag.startX;
    if (Math.abs(distance) > 4) dragMoved.current = true;
    event.currentTarget.scrollLeft = drag.startScrollLeft - distance;
    event.preventDefault();
  };

  const finishPointerDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragState.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    dragState.current = null;
    setIsDragging(false);

    const distance = event.clientX - drag.startX;
    if (Math.abs(distance) >= 48) {
      goToProject(activeIndex + (distance < 0 ? 1 : -1));
    } else {
      updateActiveProject();
    }
  };

  const preventDraggedClick = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (!dragMoved.current) return;
    event.preventDefault();
    event.stopPropagation();
    dragMoved.current = false;
  };

  return {
    activeIndex,
    autoPlayEnabled,
    finishPointerDrag,
    goToProject,
    handlePointerDown,
    handlePointerMove,
    handleScroll,
    isDragging,
    preventDraggedClick,
    registerSlide: (index: number, element: HTMLElement | null) => {
      slideRefs.current[index] = element;
    },
    setIsHovering,
    toggleAutoPlay: () => setAutoPlayEnabled((enabled) => !enabled),
    trackRef,
  };
}
