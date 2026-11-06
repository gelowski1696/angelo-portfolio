"use client";

import { ArrowDownRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

export const INTRO_SESSION_KEY = "portfolio-intro-seen";

const bootLines = [
  "INITIALIZING CREATIVE SYSTEM",
  "CHECKING INTERFACE LAYERS",
  "MOUNTING PROJECT ARCHIVE",
  "PORTFOLIO READY",
];

export function IntroExperience() {
  const [visible, setVisible] = useState(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const alreadySeen = sessionStorage.getItem(INTRO_SESSION_KEY) === "1";
    return !reducedMotion && !alreadySeen;
  });
  const [phase, setPhase] = useState<"booting" | "ready" | "exiting">(
    "booting",
  );
  const enterButton = useRef<HTMLButtonElement>(null);

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
    sessionStorage.setItem(INTRO_SESSION_KEY, "1");
    if (immediate) {
      setVisible(false);
      return;
    }

    setPhase("exiting");
    window.setTimeout(() => setVisible(false), 850);
  }, []);

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
    <div
      className={`intro-experience is-${phase}`}
      role="dialog"
      aria-modal="true"
      aria-label="Portfolio system introduction"
    >
      <div className="intro-grid" aria-hidden="true" />
      <div className="intro-terminal" aria-hidden="true">
        <div className="intro-terminal-screen">
          <span>SYS / 01</span>
          <strong>ONLINE</strong>
        </div>
        <div className="intro-terminal-base" />
      </div>

      <div className="intro-copy">
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
          <button ref={enterButton} type="button" onClick={() => finish(false)}>
            Enter portfolio <ArrowDownRight aria-hidden="true" size={18} />
          </button>
          <button type="button" onClick={() => finish(true)}>
            Skip intro
          </button>
        </div>
      </div>
    </div>
  );
}
