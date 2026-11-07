import { motion } from "motion/react";

export function ProjectMotionBackground() {
  return (
    <div className="project-motion-background" aria-hidden="true">
      <motion.span
        className="project-motion-orb project-motion-orb-dusk"
        animate={{ x: [0, 110, -35, 0], y: [0, -45, 70, 0], scale: [1, 1.12, 0.96, 1] }}
        transition={{ duration: 18, ease: "easeInOut", repeat: Infinity }}
      />
      <motion.span
        className="project-motion-orb project-motion-orb-sunset"
        animate={{ x: [0, -80, 45, 0], y: [0, 60, -30, 0], scale: [1, 0.92, 1.08, 1] }}
        transition={{ duration: 15, ease: "easeInOut", repeat: Infinity }}
      />
      <motion.span
        className="project-motion-ring"
        animate={{ rotate: 360, scale: [1, 1.04, 1] }}
        transition={{
          rotate: { duration: 34, ease: "linear", repeat: Infinity },
          scale: { duration: 9, ease: "easeInOut", repeat: Infinity },
        }}
      />
      <motion.span
        className="project-motion-line"
        animate={{ x: ["-20%", "120%"] }}
        transition={{ duration: 12, ease: "linear", repeat: Infinity }}
      />
    </div>
  );
}
