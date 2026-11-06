import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Header } from "./Header";

describe("Header", () => {
  afterEach(() => cleanup());

  it("opens and closes the mobile menu with accessible controls", async () => {
    const user = userEvent.setup();
    render(<Header name="YOUR NAME" />);

    const toggle = screen.getByRole("button", { name: "Open navigation" });
    expect(toggle).toHaveAttribute("aria-expanded", "false");

    await user.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("navigation", { name: "Mobile navigation" })).toBeVisible();

    await user.keyboard("{Escape}");
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("navigation", { name: "Mobile navigation" })).toBeNull();
  });

  it("offers a control for replaying the portfolio intro", async () => {
    const user = userEvent.setup();
    const onReplay = vi.fn();
    window.addEventListener("portfolio:replay-intro", onReplay, { once: true });
    render(<Header name="YOUR NAME" />);

    await user.click(screen.getByRole("button", { name: /replay intro/i }));

    expect(onReplay).toHaveBeenCalledOnce();
  });
});

