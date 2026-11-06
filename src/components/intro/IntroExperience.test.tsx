import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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
    vi.restoreAllMocks();
  });

  it("shows on a first visit and remembers when it is skipped", async () => {
    const user = userEvent.setup();
    render(<IntroExperience />);

    const intro = await screen.findByRole("dialog", {
      name: /portfolio system introduction/i,
    });
    expect(intro).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /skip intro/i }));

    await waitFor(() => expect(intro).not.toBeInTheDocument());
    expect(sessionStorage.getItem(INTRO_SESSION_KEY)).toBe("1");
  });

  it("does not show when reduced motion is requested", async () => {
    setReducedMotion(true);
    render(<IntroExperience />);

    await waitFor(() => {
      expect(
        screen.queryByRole("dialog", {
          name: /portfolio system introduction/i,
        }),
      ).not.toBeInTheDocument();
    });
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
    const user = userEvent.setup();

    render(<IntroExperience />);
    const intro = await screen.findByRole("dialog", {
      name: /portfolio system introduction/i,
    });
    await user.click(screen.getByRole("button", { name: /skip intro/i }));

    await waitFor(() => expect(intro).not.toBeInTheDocument());
  });

  it("disables its controls while entering the portfolio", async () => {
    const user = userEvent.setup();
    render(<IntroExperience />);

    const enter = await screen.findByRole("button", {
      name: /enter portfolio/i,
    });
    await user.click(enter);

    expect(enter).toBeDisabled();
    expect(screen.getByRole("button", { name: /skip intro/i })).toBeDisabled();
  });
});
