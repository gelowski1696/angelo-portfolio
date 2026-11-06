"use client";

import dynamic from "next/dynamic";
import { useState, useSyncExternalStore } from "react";
import {
  readClientCapabilities,
  shouldRenderWebGL,
} from "@/lib/capabilities";

const HeroScene = dynamic(
  () => import("./HeroScene").then((module) => module.HeroScene),
  { ssr: false },
);

const subscribeToCapabilities = () => () => undefined;
const getServerCapabilities = () => false;
const getClientCapabilities = () =>
  shouldRenderWebGL(readClientCapabilities());

function StaticCore() {
  return (
    <div className="static-core">
      <div className="core-orbit core-orbit-one" />
      <div className="core-orbit core-orbit-two" />
      <div className="core-shell">
        <div className="core-screen">
          <span>SYS/PORTFOLIO</span>
          <div className="screen-graph">
            <i />
            <i />
            <i />
            <i />
          </div>
          <strong>READY</strong>
        </div>
      </div>
    </div>
  );
}

export function HeroVisual() {
  const webglEnabled = useSyncExternalStore(
    subscribeToCapabilities,
    getClientCapabilities,
    getServerCapabilities,
  );
  const [sceneFailed, setSceneFailed] = useState(false);

  return (
    <div
      className={`hero-visual ${webglEnabled && !sceneFailed ? "is-webgl" : ""}`}
      aria-hidden="true"
      data-hero-visual
    >
      <StaticCore />
      {webglEnabled && !sceneFailed ? (
        <HeroScene onFailure={() => setSceneFailed(true)} />
      ) : null}
    </div>
  );
}

