"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLayoutEffect } from "react";

export function MotionOrchestrator() {
  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const context = gsap.context(() => {
      gsap.fromTo(
        ".hero-copy > *",
        { y: 38, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.09,
          ease: "expo.out",
          delay: 0.15,
        },
      );

      gsap.to("[data-hero-visual]", {
        yPercent: 10,
        rotate: 1.5,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "bottom top",
          scrub: 0.8,
        },
      });

      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((element) => {
        gsap.fromTo(
          element,
          { y: 42, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: "expo.out",
            scrollTrigger: {
              trigger: element,
              start: "top 86%",
              once: true,
            },
          },
        );
      });
    });

    return () => {
      context.revert();
    };
  }, []);

  return null;
}

