import { cleanup, render, screen } from "@testing-library/react";
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
});
