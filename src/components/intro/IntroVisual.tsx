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

export function IntroVisual({ exiting }: { exiting: boolean }) {
  const webglEnabled = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  const [failed, setFailed] = useState(false);

  return (
    <div className="intro-visual" aria-hidden="true">
      <div className="intro-terminal">
        <div className="intro-terminal-screen">
          <span>SYS / 01</span>
          <strong>ONLINE</strong>
        </div>
        <div className="intro-terminal-base" />
      </div>
      {webglEnabled && !failed ? (
        <IntroScene exiting={exiting} onFailure={() => setFailed(true)} />
      ) : null}
    </div>
  );
}
