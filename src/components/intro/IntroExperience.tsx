"use client";

import { ArrowDownRight } from "lucide-react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
} from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { INTRO_REPLAY_EVENT } from "./intro-events";
import { IntroVisual } from "./IntroVisual";

export const INTRO_SESSION_KEY = "portfolio-intro-seen";

const bootLines = [
  "INITIALIZING CREATIVE SYSTEM",
  "CHECKING INTERFACE LAYERS",
  "MOUNTING PROJECT ARCHIVE",
  "PORTFOLIO READY",
];

function hasSeenIntro() {
  try {
    return sessionStorage.getItem(INTRO_SESSION_KEY) === "1";
  } catch {
    return false;
  }
}

function rememberIntro() {
  try {
    sessionStorage.setItem(INTRO_SESSION_KEY, "1");
  } catch {
    // Storage can be unavailable in privacy-restricted browsers.
  }
}

export function IntroExperience() {
  const [visible, setVisible] = useState(() => !hasSeenIntro());
  const [phase, setPhase] = useState<"booting" | "ready" | "exiting">(
    "booting",
  );
  const enterButton = useRef<HTMLButtonElement>(null);
  const exitTimer = useRef<number | null>(null);
  const pointerX = useMotionValue(50);
  const pointerY = useMotionValue(45);
  const springX = useSpring(pointerX, { stiffness: 120, damping: 24, mass: 0.4 });
  const springY = useSpring(pointerY, { stiffness: 120, damping: 24, mass: 0.4 });
  const glowX = useMotionTemplate`${springX}%`;
  const glowY = useMotionTemplate`${springY}%`;

  useEffect(
    () => () => {
      if (exitTimer.current !== null) window.clearTimeout(exitTimer.current);
    },
    [],
  );

  useEffect(() => {
    const replayIntro = () => {
      if (exitTimer.current !== null) {
        window.clearTimeout(exitTimer.current);
        exitTimer.current = null;
      }
      setPhase("booting");
      setVisible(true);
    };

    window.addEventListener(INTRO_REPLAY_EVENT, replayIntro);
    return () => window.removeEventListener(INTRO_REPLAY_EVENT, replayIntro);
  }, []);

  useEffect(() => {
    if (!visible) return;

    const pageRegions = document.querySelectorAll<HTMLElement>(
      ".site-header, main, .site-footer",
    );
    pageRegions.forEach((region) => {
      region.inert = true;
      region.setAttribute("aria-hidden", "true");
    });
    document.documentElement.dataset.intro = "active";
    enterButton.current?.focus();

    const readyTimer = window.setTimeout(() => setPhase("ready"), 900);
    return () => {
      window.clearTimeout(readyTimer);
      delete document.documentElement.dataset.intro;
      pageRegions.forEach((region) => {
        region.inert = false;
        region.removeAttribute("aria-hidden");
      });
    };
  }, [visible]);

  const finish = useCallback((immediate = false) => {
    if (phase === "exiting") return;
    rememberIntro();
    if (immediate) {
      setVisible(false);
      return;
    }

    setPhase("exiting");
    exitTimer.current = window.setTimeout(() => setVisible(false), 850);
  }, [phase]);

  useEffect(() => {
    if (!visible) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") finish(true);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [finish, visible]);

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (event.pointerType === "touch") return;
      const bounds = event.currentTarget.getBoundingClientRect();
      pointerX.set(((event.clientX - bounds.left) / bounds.width) * 100);
      pointerY.set(((event.clientY - bounds.top) / bounds.height) * 100);
    },
    [pointerX, pointerY],
  );

  const resetPointer = useCallback(() => {
    pointerX.set(50);
    pointerY.set(45);
  }, [pointerX, pointerY]);

  if (!visible) return null;

  return (
    <motion.div
      className={`intro-experience is-${phase}`}
      role="dialog"
      aria-modal="true"
      aria-label="Portfolio system introduction"
      onPointerMove={handlePointerMove}
      onPointerLeave={resetPointer}
      initial={{ opacity: 0, scale: 1.015 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="intro-grid" aria-hidden="true" />
      <motion.div
        className="intro-pointer-glow"
        aria-hidden="true"
        style={{ left: glowX, top: glowY }}
      />
      <IntroVisual exiting={phase === "exiting"} />

      <motion.div
        className="intro-copy"
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
      >
        <p className="intro-kicker">Interactive portfolio / 2026</p>
        <h2>Enter the system.</h2>
        <div className="intro-boot" aria-live="polite">
          {bootLines.map((line, index) => (
            <span key={line} style={{ "--boot-index": index } as React.CSSProperties}>
              {line}
            </span>
          ))}
        </div>
        <div className="intro-actions">
          <motion.button
            ref={enterButton}
            type="button"
            disabled={phase === "exiting"}
            onClick={() => finish(false)}
            whileHover={{ x: 5, scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 360, damping: 24 }}
          >
            Enter portfolio <ArrowDownRight aria-hidden="true" size={18} />
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
