export type ClientCapabilities = {
  webglAvailable: boolean;
  saveData: boolean;
};

export function shouldRenderWebGL({
  webglAvailable,
  saveData,
}: ClientCapabilities): boolean {
  return webglAvailable && !saveData;
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
    saveData: Boolean(connection?.saveData),
  };
}

