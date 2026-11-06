"use client";

import type { CSSProperties, ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";

type AnimatedProjectProps = {
  accent: string;
  children: ReactNode;
};

export function AnimatedProject({ accent, children }: AnimatedProjectProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.article
      className="project-showcase"
      style={{ "--project-accent": accent } as CSSProperties}
      initial={reduceMotion ? false : { opacity: 0, y: 56 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      whileHover={reduceMotion ? undefined : { y: -6 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.article>
  );
}
