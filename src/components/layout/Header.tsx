"use client";

import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { INTRO_REPLAY_EVENT } from "@/components/intro/intro-events";

const navigation = [
  { href: "#about", label: "About" },
  { href: "#projects", label: "Projects" },
  { href: "#stack", label: "Stack" },
  { href: "#experience", label: "Experience" },
  { href: "#contact", label: "Contact" },
];

type HeaderProps = {
  name: string;
};

export function Header({ name }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const replayIntro = () => {
    setMenuOpen(false);
    window.dispatchEvent(new Event(INTRO_REPLAY_EVENT));
  };

  useEffect(() => {
    if (!menuOpen) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [menuOpen]);

  return (
    <header className="site-header">
      <a className="wordmark" href="#top" aria-label="Go to the top">
        &lt;{name} /&gt;
      </a>

      <nav className="desktop-nav" aria-label="Primary navigation">
        {navigation.map((item) => (
          <a href={item.href} key={item.href}>
            {item.label}
          </a>
        ))}
        <button type="button" onClick={replayIntro}>
          Replay intro
        </button>
      </nav>

      <button
        className="menu-toggle"
        type="button"
        aria-expanded={menuOpen}
        aria-controls="mobile-navigation"
        aria-label={menuOpen ? "Close navigation" : "Open navigation"}
        onClick={() => setMenuOpen((current) => !current)}
      >
        {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
      </button>

      {menuOpen ? (
        <nav
          className="mobile-nav"
          id="mobile-navigation"
          aria-label="Mobile navigation"
        >
          {navigation.map((item, index) => (
            <a
              href={item.href}
              key={item.href}
              onClick={() => setMenuOpen(false)}
            >
              <span>0{index + 1}</span>
              {item.label}
            </a>
          ))}
          <button type="button" onClick={replayIntro}>
            <span>06</span>
            Replay intro
          </button>
        </nav>
      ) : null}
    </header>
  );
}

