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
import { useBootProgress } from "./useBootProgress";

export const INTRO_SESSION_KEY = "portfolio-intro-seen";

const bootLines = [
  { text: "INITIALIZING CREATIVE SYSTEM", threshold: 3 },
  { text: "CHECKING INTERFACE LAYERS", threshold: 28 },
  { text: "MOUNTING PROJECT ARCHIVE", threshold: 55 },
  { text: "PORTFOLIO READY", threshold: 85 },
];

type IntroPhase = "booting" | "ready" | "entering";
type PointerPosition = { x: number; y: number };

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
function HeadlineReveal() {
  const lines = ["ENTER THE", "SYSTEM."];
  let letterIndex = 0;

  return (
    <h1 className="intro-headline" aria-label="Enter the system.">
      {lines.map((line) => (
        <span className="intro-headline-line" key={line} aria-hidden="true">
          {Array.from(line).map((letter) => {
            const delay = 0.2 + letterIndex * 0.055;
            letterIndex += 1;
            return (
              <motion.span
                className={letter === "." ? "intro-headline-letter is-accent" : "intro-headline-letter"}
                key={`${line}-${letterIndex}`}
                initial={{ opacity: 0, rotateX: -110, y: "35%" }}
                animate={{ opacity: 1, rotateX: 0, y: 0 }}
                transition={{
                  delay,
                  type: "spring",
                  stiffness: 220,
                  damping: 16,
                  mass: 0.9,
                }}
              >
                {letter === " " ? "\u00a0" : letter}
              </motion.span>
            );
          })}
        </span>
      ))}
    </h1>
  );
}
function BootLog({ progress }: { progress: number }) {
  return (
    <div className="intro-boot" role="log" aria-live="polite" aria-label="System boot log">
      {bootLines.map((line, index) => {
        const active = progress >= line.threshold;
        const complete = progress >= (bootLines[index + 1]?.threshold ?? 100);
        return (
          <motion.span
            className={active ? "is-active" : undefined}
            key={line.text}
            initial={{ opacity: 0, x: -14 }}
            animate={{ opacity: active ? 1 : 0.28, x: active ? 0 : -4 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="intro-boot-prompt">&gt;</span>
            <span>{line.text}</span>
            <strong>{complete ? "OK" : "···"}</strong>
          </motion.span>
        );
      })}
    </div>
  );
}

function BootProgress({ progress }: { progress: number }) {
  return (
    <div className="intro-progress-row">
      <span className="intro-progress-label">BOOT STATUS</span>
      <div
        className="intro-progress-bar"
        role="progressbar"
        aria-label="Portfolio boot progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progress}
        aria-valuetext={`${progress}% loaded`}
      >
        <span style={{ width: `${progress}%` }} />
      </div>
      <strong>{String(progress).padStart(3, "0")}%</strong>
    </div>
  );
}

export function IntroExperience() {
  const [visible, setVisible] = useState(() => !hasSeenIntro());
  const [phase, setPhase] = useState<IntroPhase>("booting");
  const [cycle, setCycle] = useState(0);
  const [pointer, setPointer] = useState<PointerPosition>({ x: 0, y: 0 });
  const enterButton = useRef<HTMLButtonElement>(null);
  const skipButton = useRef<HTMLButtonElement>(null);
  const exitTimer = useRef<number | null>(null);
  const progress = useBootProgress(visible && phase === "booting", cycle);
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
      setCycle((current) => current + 1);
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

    if (phase === "booting" && progress < 100) skipButton.current?.focus();
    else enterButton.current?.focus();

    return () => {
      delete document.documentElement.dataset.intro;
      pageRegions.forEach((region) => {
        region.inert = false;
        region.removeAttribute("aria-hidden");
      });
    };
  }, [phase, progress, visible]);

  const ready = phase === "ready" || (phase === "booting" && progress >= 100);

  const finish = useCallback(
    (immediate = false) => {
      if (phase === "entering") return;
      if (!immediate && !ready) return;

      rememberIntro();
      if (immediate) {
        setVisible(false);
        return;
      }

      setPhase("entering");
      exitTimer.current = window.setTimeout(() => setVisible(false), 700);
    },
    [phase, ready],
  );

  const replay = useCallback(() => {
    if (exitTimer.current !== null) {
      window.clearTimeout(exitTimer.current);
      exitTimer.current = null;
    }
    setCycle((current) => current + 1);
    setPhase("booting");
  }, []);

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
      const x = (event.clientX - bounds.left) / bounds.width - 0.5;
      const y = (event.clientY - bounds.top) / bounds.height - 0.5;
      pointerX.set((x + 0.5) * 100);
      pointerY.set((y + 0.5) * 100);
      setPointer({ x, y });
    },
    [pointerX, pointerY],
  );

  const resetPointer = useCallback(() => {
    pointerX.set(50);
    pointerY.set(45);
    setPointer({ x: 0, y: 0 });
  }, [pointerX, pointerY]);

  if (!visible) return null;

  const entering = phase === "entering";
  const renderPhase = entering ? "entering" : ready ? "ready" : "booting";

  return (
    <motion.div
      className={`intro-experience is-${renderPhase}`}
      role="dialog"
      aria-modal="true"
      aria-label="Portfolio system introduction"
      onPointerMove={handlePointerMove}
      onPointerLeave={resetPointer}
      initial={{ scale: 1.015 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="intro-system-bar" aria-hidden="true">
        <span><i /> PORTFOLIO SYS</span>
        <span>{ready ? "SYSTEM READY" : "SYSTEM BOOT"}</span>
      </div>
      <p className="intro-scene-label" aria-hidden="true">SCENE / SYS 01</p>
      <div className="intro-grid" aria-hidden="true" />
      <motion.div
        className="intro-pointer-glow"
        aria-hidden="true"
        style={{ left: glowX, top: glowY }}
      />
      <div className="intro-hud intro-hud-top" aria-hidden="true" />
      <div className="intro-hud intro-hud-bottom" aria-hidden="true" />
      <IntroVisual exiting={entering} progress={progress} pointer={pointer} />

      <motion.div
        className="intro-copy"
        animate={entering ? { opacity: 0, y: -24 } : { opacity: 1, y: 0 }}
        transition={{ duration: entering ? 0.65 : 0.7, delay: entering ? 0 : 0.12 }}
      >
        <p className="intro-kicker"><span aria-hidden="true" /> Interactive portfolio / 2026</p>
        <HeadlineReveal />
        <BootLog progress={progress} />
        <BootProgress progress={progress} />
        <div className="intro-actions">
          <motion.button
            ref={enterButton}
            className={ready ? "is-ready" : undefined}
            type="button"
            disabled={!ready || entering}
            aria-disabled={!ready || entering}
            onClick={() => finish(false)}
            whileHover={ready ? { x: 5, scale: 1.02 } : undefined}
            whileTap={ready ? { scale: 0.97 } : undefined}
            transition={{ type: "spring", stiffness: 360, damping: 24 }}
          >
            {ready ? "Enter portfolio" : `Booting ${String(progress).padStart(3, "0")}%`}
            {ready ? <ArrowDownRight aria-hidden="true" size={18} /> : null}
          </motion.button>
        </div>
      </motion.div>

      {!ready && !entering ? (
        <button
          ref={skipButton}
          className="intro-skip"
          type="button"
          onClick={() => finish(true)}
        >
          Skip intro <span aria-hidden="true">↗</span>
        </button>
      ) : null}

      <p className="intro-stage-readout" aria-hidden="true">
        CAM {pointer.x >= 0 ? "+" : "−"}{Math.abs(pointer.x).toFixed(2)} / {pointer.y >= 0 ? "+" : "−"}{Math.abs(pointer.y).toFixed(2)} · MOVE TO ORBIT
      </p>
      <button className="intro-replay" type="button" onClick={replay}>
        ↻ Replay intro
      </button>
      <p className="intro-archive-index" aria-hidden="true">01 / 08 · ARCHIVE</p>
    </motion.div>
  );
}

