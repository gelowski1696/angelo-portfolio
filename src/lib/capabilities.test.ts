import { describe, expect, it } from "vitest";
import { shouldRenderWebGL } from "./capabilities";

describe("shouldRenderWebGL", () => {
  it("renders the scene when the browser supports it", () => {
    expect(
      shouldRenderWebGL({
        webglAvailable: true,
        reducedMotion: false,
        saveData: false,
      }),
    ).toBe(true);
  });

  it.each([
    { webglAvailable: false, reducedMotion: false, saveData: false },
    { webglAvailable: true, reducedMotion: true, saveData: false },
    { webglAvailable: true, reducedMotion: false, saveData: true },
  ])("uses the static fallback for constrained browsers", (capabilities) => {
    expect(shouldRenderWebGL(capabilities)).toBe(false);
  });
});

