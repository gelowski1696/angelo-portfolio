import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { portfolio } from "@/data/portfolio";
import { ProjectCarousel } from "./ProjectCarousel";

describe("ProjectCarousel", () => {
  const projects = portfolio.projects.slice(0, 3);
  const scrollTo = vi.fn();

  beforeEach(() => {
    Object.defineProperty(HTMLElement.prototype, "scrollTo", {
      configurable: true,
      value: scrollTo,
    });
  });

  afterEach(() => {
    cleanup();
    scrollTo.mockReset();
    vi.useRealTimers();
  });

  it("moves between projects with accessible controls", async () => {
    const user = userEvent.setup();
    render(<ProjectCarousel projects={projects} />);

    expect(screen.getByText("01 / 03")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /previous project/i }),
    ).toBeDisabled();

    await user.click(screen.getByRole("button", { name: /next project/i }));

    expect(screen.getByText("02 / 03")).toBeInTheDocument();
    expect(scrollTo).toHaveBeenCalledTimes(1);
    expect(
      screen.getByRole("button", { name: /previous project/i }),
    ).toBeEnabled();
  });

  it("shows each landing page screenshot as meaningful content", () => {
    render(<ProjectCarousel projects={projects} />);

    expect(
      screen.getByAltText("VMJAMTECH VPOS landing page"),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("group", { name: /project \d of 3/i })).toHaveLength(
      3,
    );
  });

  it("automatically advances while autoplay is enabled", () => {
    vi.useFakeTimers();
    render(<ProjectCarousel projects={projects} />);

    expect(
      screen.getByRole("button", { name: /pause project autoplay/i }),
    ).toBeInTheDocument();

    act(() => vi.advanceTimersByTime(5000));

    expect(screen.getByText("02 / 03")).toBeInTheDocument();
  });

  it("pauses autoplay and supports pointer swiping", () => {
    vi.useFakeTimers();
    render(<ProjectCarousel projects={projects} />);

    fireEvent.click(
      screen.getByRole("button", { name: /pause project autoplay/i }),
    );
    act(() => vi.advanceTimersByTime(5000));
    expect(screen.getByText("01 / 03")).toBeInTheDocument();

    const track = screen.getByRole("region", { name: /selected projects/i });
    Object.defineProperty(track, "scrollLeft", {
      configurable: true,
      value: 100,
      writable: true,
    });

    fireEvent.pointerDown(track, {
      pointerId: 1,
      pointerType: "mouse",
      clientX: 300,
    });
    fireEvent.pointerMove(track, {
      pointerId: 1,
      pointerType: "mouse",
      clientX: 150,
    });

    expect(track.scrollLeft).toBe(250);
    expect(track).toHaveClass("is-dragging");

    fireEvent.pointerUp(track, { pointerId: 1, pointerType: "mouse" });
    expect(track).not.toHaveClass("is-dragging");
  });
});
