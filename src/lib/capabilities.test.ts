import { describe, expect, it } from "vitest";
import { shouldRenderWebGL } from "./capabilities";

describe("shouldRenderWebGL", () => {
  it("renders the scene when the browser supports it", () => {
    expect(
      shouldRenderWebGL({
        webglAvailable: true,
        saveData: false,
      }),
    ).toBe(true);
  });

  it.each([
    { webglAvailable: false, saveData: false },
    { webglAvailable: true, saveData: true },
  ])("uses the static fallback for constrained browsers", (capabilities) => {
    expect(shouldRenderWebGL(capabilities)).toBe(false);
  });
});

