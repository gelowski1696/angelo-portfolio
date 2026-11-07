import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { INTRO_SESSION_KEY, IntroExperience } from "./IntroExperience";

function setReducedMotion(matches: boolean) {
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    value: vi.fn().mockReturnValue({
      matches,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }),
  });
}

describe("IntroExperience", () => {
  beforeEach(() => {
    sessionStorage.clear();
    setReducedMotion(false);
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("shows on a first visit and remembers after entering", () => {
    vi.useFakeTimers();
    render(<IntroExperience />);

    const intro = screen.getByRole("dialog", {
      name: /portfolio system introduction/i,
    });
    expect(intro).toBeInTheDocument();
    expect(intro.querySelector(".intro-pointer-glow")).toBeInTheDocument();

    act(() => vi.advanceTimersByTime(3000));
    const enter = screen.getByRole("button", { name: /enter portfolio/i });
    expect(enter).toBeEnabled();
    fireEvent.click(enter);
    act(() => vi.advanceTimersByTime(1900));

    expect(intro).not.toBeInTheDocument();
    expect(sessionStorage.getItem(INTRO_SESSION_KEY)).toBe("1");
  });

  it("still shows when reduced motion is requested", async () => {
    setReducedMotion(true);
    render(<IntroExperience />);

    expect(
      await screen.findByRole("dialog", {
        name: /portfolio system introduction/i,
      }),
    ).toBeInTheDocument();
  });

  it("does not show again in the same session", async () => {
    sessionStorage.setItem(INTRO_SESSION_KEY, "1");
    render(<IntroExperience />);

    await waitFor(() => {
      expect(
        screen.queryByRole("dialog", {
          name: /portfolio system introduction/i,
        }),
      ).not.toBeInTheDocument();
    });
  });

  it("can be replayed after it has been dismissed in the same session", async () => {
    sessionStorage.setItem(INTRO_SESSION_KEY, "1");
    render(<IntroExperience />);

    window.dispatchEvent(new Event("portfolio:replay-intro"));

    expect(
      await screen.findByRole("dialog", {
        name: /portfolio system introduction/i,
      }),
    ).toBeInTheDocument();
  });

  it("remains usable when session storage is unavailable", async () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new DOMException("Storage blocked", "SecurityError");
    });
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("Storage blocked", "SecurityError");
    });
    render(<IntroExperience />);
    const intro = await screen.findByRole("dialog", {
      name: /portfolio system introduction/i,
    });
    fireEvent.click(screen.getByRole("button", { name: /skip intro/i }));

    await waitFor(() => expect(intro).not.toBeInTheDocument());
  });

  it("disables the enter control while entering the portfolio", async () => {
    vi.useFakeTimers();
    render(<IntroExperience />);

    act(() => vi.advanceTimersByTime(3000));
    const enter = screen.getByRole("button", { name: /enter portfolio/i });
    fireEvent.click(enter);

    expect(enter).toBeDisabled();
  });
});
