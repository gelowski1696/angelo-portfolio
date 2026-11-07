import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { portfolio } from "@/data/portfolio";
import { ProjectCarousel } from "./ProjectCarousel";

describe("ProjectCarousel", () => {
  const projects = portfolio.projects.slice(0, 3);

  beforeEach(() => {
    vi.useRealTimers();
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  it("moves between projects with looping accessible controls", async () => {
    const user = userEvent.setup();
    render(<ProjectCarousel projects={projects} />);

    expect(screen.getByText("01 / 03")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /previous project/i }),
    ).toBeEnabled();

    await user.click(screen.getByRole("button", { name: /next project/i }));
    expect(screen.getByText("02 / 03")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /previous project/i }));
    await user.click(screen.getByRole("button", { name: /previous project/i }));
    expect(screen.getByText("03 / 03")).toBeInTheDocument();
  });

  it("keeps every landing page screenshot in the carousel track", () => {
    const { container } = render(<ProjectCarousel projects={projects} />);

    expect(
      screen.getByAltText("VMJAMTECH VPOS landing page"),
    ).toBeInTheDocument();
    expect(container.querySelectorAll(".project-slide")).toHaveLength(3);
    expect(container.querySelectorAll(".project-art-image")).toHaveLength(3);
  });

  it("automatically advances while autoplay is enabled", () => {
    vi.useFakeTimers();
    render(<ProjectCarousel projects={projects} />);

    expect(
      screen.getByRole("button", { name: /pause project autoplay/i }),
    ).toBeInTheDocument();

    act(() => vi.advanceTimersByTime(5200));
    expect(screen.getByText("02 / 03")).toBeInTheDocument();
  });

  it("pauses autoplay and supports keyboard navigation", () => {
    vi.useFakeTimers();
    render(<ProjectCarousel projects={projects} />);

    fireEvent.click(
      screen.getByRole("button", { name: /pause project autoplay/i }),
    );
    act(() => vi.advanceTimersByTime(5200));
    expect(screen.getByText("01 / 03")).toBeInTheDocument();

    const viewport = screen.getByRole("region", { name: /selected projects/i });
    fireEvent.keyDown(viewport, { key: "ArrowRight" });
    expect(screen.getByText("02 / 03")).toBeInTheDocument();
    fireEvent.keyDown(viewport, { key: "ArrowLeft" });
    expect(screen.getByText("01 / 03")).toBeInTheDocument();
  });
});
