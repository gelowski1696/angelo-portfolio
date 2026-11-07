"use client";

import dynamic from "next/dynamic";
import { useState, useSyncExternalStore } from "react";
import { readClientCapabilities, shouldRenderWebGL } from "@/lib/capabilities";

const IntroScene = dynamic(
  () => import("./IntroScene").then((module) => module.IntroScene),
  { ssr: false },
);

const subscribe = () => () => undefined;
const getServerSnapshot = () => false;
const getSnapshot = () => shouldRenderWebGL(readClientCapabilities());

type IntroVisualProps = {
  exiting: boolean;
  pointer: { x: number; y: number };
  progress: number;
};

export function IntroVisual({ exiting, pointer, progress }: IntroVisualProps) {
  const webglEnabled = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  const [failed, setFailed] = useState(false);
  const [sceneReady, setSceneReady] = useState(false);
  const showFallback = !webglEnabled || failed || !sceneReady;

  return (
    <div className="intro-visual" aria-hidden="true">
      {showFallback ? (
        <div className="intro-terminal">
          <div className="intro-terminal-screen">
            <span><b>SYS / 01</b><b>{progress >= 100 ? "READY" : "INIT"}</b></span>
            <strong>{progress >= 100 ? "ONLINE" : `${String(progress).padStart(3, "0")}%`}</strong>
            <i style={{ width: `${progress}%` }} />
          </div>
          <div className="intro-terminal-leds" aria-hidden="true"><i /><i className={progress >= 55 ? "is-on" : undefined} /><i className={progress >= 100 ? "is-on" : undefined} /></div>
          <div className="intro-terminal-base" />
        </div>
      ) : null}
      {webglEnabled && !failed ? (
        <IntroScene
          exiting={exiting}
          pointer={pointer}
          progress={progress}
          onReady={() => setSceneReady(true)}
          onFailure={() => setFailed(true)}
        />
      ) : null}
      <div className="intro-stage-chip intro-stage-chip-a" aria-hidden="true">LAYER 01 / INTERFACE</div>
      <div className="intro-stage-chip intro-stage-chip-b" aria-hidden="true">PROJ_01 / ARCHIVE</div>
    </div>
  );
}
