export type ClientCapabilities = {
  webglAvailable: boolean;
  reducedMotion: boolean;
  saveData: boolean;
};

export function shouldRenderWebGL({
  webglAvailable,
  reducedMotion,
  saveData,
}: ClientCapabilities): boolean {
  return webglAvailable && !reducedMotion && !saveData;
}

function detectWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")),
    );
  } catch {
    return false;
  }
}

export function readClientCapabilities(): ClientCapabilities {
  const connection = (
    navigator as Navigator & { connection?: { saveData?: boolean } }
  ).connection;

  return {
    webglAvailable: detectWebGL(),
    reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    saveData: Boolean(connection?.saveData),
  };
}

