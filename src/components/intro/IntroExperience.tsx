"use client";

import { ArrowDownRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
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
  const reduceMotion = useReducedMotion();
  const [visible, setVisible] = useState(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    return !reducedMotion && !hasSeenIntro();
  });
  const [phase, setPhase] = useState<"booting" | "ready" | "exiting">(
    "booting",
  );
  const enterButton = useRef<HTMLButtonElement>(null);
  const exitTimer = useRef<number | null>(null);

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

  const finish = useCallback((immediate: boolean) => {
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

  if (!visible) return null;

  return (
    <motion.div
      className={`intro-experience is-${phase}`}
      role="dialog"
      aria-modal="true"
      aria-label="Portfolio system introduction"
      initial={reduceMotion ? false : { opacity: 0, scale: 1.015 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="intro-grid" aria-hidden="true" />
      <IntroVisual exiting={phase === "exiting"} />

      <motion.div
        className="intro-copy"
        initial={reduceMotion ? false : { opacity: 0, y: 32 }}
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
          <button
            ref={enterButton}
            type="button"
            disabled={phase === "exiting"}
            onClick={() => finish(false)}
          >
            Enter portfolio <ArrowDownRight aria-hidden="true" size={18} />
          </button>
          <button
            type="button"
            disabled={phase === "exiting"}
            onClick={() => finish(true)}
          >
            Skip intro
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
