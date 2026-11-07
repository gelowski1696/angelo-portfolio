"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Edges, RoundedBox } from "@react-three/drei";
import { Component, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import * as THREE from "three";

class IntroSceneBoundary extends Component<
  { children: ReactNode; onFailure: () => void },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch() {
    this.props.onFailure();
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

type PointerPosition = { x: number; y: number };

const SCREEN_WIDTH = 1024;
const SCREEN_HEIGHT = 640;

function drawTerminalScreen(
  canvas: HTMLCanvasElement,
  progress: number,
) {
  const context = canvas.getContext("2d");
  if (!context) return;

  canvas.width = SCREEN_WIDTH;
  canvas.height = SCREEN_HEIGHT;

  const safeProgress = Math.max(0, Math.min(100, progress));
  const background = context.createLinearGradient(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
  background.addColorStop(0, "#ffd0a8");
  background.addColorStop(0.58, "#f4a877");
  background.addColorStop(1, "#e98152");
  context.fillStyle = background;
  context.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

  context.strokeStyle = "rgba(12, 26, 54, 0.13)";
  context.lineWidth = 2;
  for (let y = 8; y < SCREEN_HEIGHT; y += 12) {
    context.beginPath();
    context.moveTo(0, y);
    context.lineTo(SCREEN_WIDTH, y);
    context.stroke();
  }

  const glow = context.createRadialGradient(720, 90, 0, 720, 90, 260);
  glow.addColorStop(0, "rgba(255, 255, 255, 0.58)");
  glow.addColorStop(1, "rgba(255, 255, 255, 0)");
  context.fillStyle = glow;
  context.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

  context.fillStyle = "#0c1a36";
  context.textBaseline = "middle";
  context.font = "700 28px 'Courier New', monospace";
  context.fillText("SYS / 01", 64, 66);
  context.textAlign = "right";
  context.fillText(safeProgress >= 100 ? "READY" : "INIT", 960, 66);

  context.textAlign = "left";
  context.font = "700 34px 'Courier New', monospace";
  context.fillText("CREATIVE INTERFACE", 64, 132);

  context.font = "900 142px Arial, sans-serif";
  context.letterSpacing = "-7px";
  context.fillText(safeProgress >= 100 ? "ONLINE" : "BOOTING", 58, 310);
  context.letterSpacing = "0px";

  context.font = "700 25px 'Courier New', monospace";
  context.fillText(
    safeProgress >= 100
      ? "PORTFOLIO ARCHIVE MOUNTED"
      : `INITIALIZING / ${String(safeProgress).padStart(3, "0")}%`,
    64,
    416,
  );

  const segmentCount = 20;
  const litSegments = Math.floor((safeProgress / 100) * segmentCount);
  const segmentGap = 9;
  const segmentWidth = 39;
  for (let index = 0; index < segmentCount; index += 1) {
    context.fillStyle = index < litSegments ? "#0c1a36" : "rgba(12, 26, 54, 0.2)";
    context.fillRect(64 + index * (segmentWidth + segmentGap), 505, segmentWidth, 30);
  }

  context.fillStyle = "rgba(12, 26, 54, 0.72)";
  context.font = "700 20px 'Courier New', monospace";
  context.fillText("PORTFOLIO.SYS / BUILD 2026", 64, 584);
}

function createTerminalTexture() {
  const canvas = document.createElement("canvas");
  drawTerminalScreen(canvas, 0);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;
  return texture;
}

function updateTerminalTexture(texture: THREE.CanvasTexture, progress: number) {
  drawTerminalScreen(texture.image, progress);
  texture.needsUpdate = true;
}

function SceneReady({ onReady }: { onReady: () => void }) {
  const reported = useRef(false);

  useFrame(() => {
    if (reported.current) return;
    reported.current = true;
    onReady();
  });

  return null;
}

function TerminalScreen({ progress }: { progress: number }) {
  const [texture] = useState(createTerminalTexture);
  const displayProgress = Math.min(100, Math.floor(progress / 5) * 5);

  useEffect(() => {
    updateTerminalTexture(texture, displayProgress);
  }, [displayProgress, texture]);

  useEffect(() => () => texture.dispose(), [texture]);

  return (
    <mesh position={[0, 0.24, 0.505]}>
      <planeGeometry args={[2.82, 1.76]} />
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
  );
}

function Terminal({ exiting, pointer, progress }: { exiting: boolean; pointer: PointerPosition; progress: number }) {
  const scene = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    const targetZ = exiting ? 4.5 : 15;
    const targetY = exiting ? 0.2 : 0.4;
    state.camera.position.z = THREE.MathUtils.damp(state.camera.position.z, targetZ, 3.2, delta);
    state.camera.position.y = THREE.MathUtils.damp(state.camera.position.y, targetY, 2.2, delta);
    state.camera.lookAt(0, 0, 0);

    if (scene.current) {
      const idleY = Math.sin(state.clock.elapsedTime / 2.3) * 0.08;
      const idleX = Math.sin(state.clock.elapsedTime / 3.1) * 0.035;
      scene.current.rotation.y = THREE.MathUtils.damp(
        scene.current.rotation.y,
        exiting ? 0 : idleY + pointer.x * 0.28 - 0.18,
        6,
        delta,
      );
      scene.current.rotation.x = THREE.MathUtils.damp(
        scene.current.rotation.x,
        exiting ? 0 : idleX - pointer.y * 0.18,
        6,
        delta,
      );
      scene.current.position.x = THREE.MathUtils.damp(
        scene.current.position.x,
        exiting ? 0 : -pointer.x * 0.16,
        6,
        delta,
      );
      scene.current.position.y = THREE.MathUtils.damp(
        scene.current.position.y,
        exiting ? 0 : -pointer.y * 0.09,
        6,
        delta,
      );
    }

  });

  return (
    <group ref={scene} position={[0, 0.35, 0]}>
      <RoundedBox args={[3.72, 2.88, 0.74]} radius={0.13} smoothness={4} castShadow receiveShadow>
        <meshStandardMaterial color="#13243e" metalness={0.42} roughness={0.48} />
        <Edges color="#f28c5a" threshold={22} />
      </RoundedBox>

      <RoundedBox args={[3.18, 2.14, 0.15]} radius={0.08} smoothness={3} position={[0, 0.24, 0.41]}>
        <meshStandardMaterial color="#050b16" metalness={0.62} roughness={0.32} />
        <Edges color="#35547a" threshold={22} />
      </RoundedBox>
      <TerminalScreen progress={progress} />

      <mesh position={[-1.47, -1.06, 0.42]}>
        <circleGeometry args={[0.08, 20]} />
        <meshBasicMaterial color="#f28c5a" toneMapped={false} />
      </mesh>
      {[0, 1].map((index) => (
        <mesh key={index} position={[-1.2 + index * 0.24, -1.06, 0.42]}>
          <circleGeometry args={[0.045, 16]} />
          <meshBasicMaterial
            color={index === 0 || progress >= 100 ? "#f4a877" : "#27415f"}
            toneMapped={false}
          />
        </mesh>
      ))}
      {Array.from({ length: 7 }, (_, index) => (
        <mesh key={index} position={[0.48 + index * 0.17, -1.06, 0.43]}>
          <boxGeometry args={[0.1, 0.035, 0.025]} />
          <meshBasicMaterial color="#6b82a1" />
        </mesh>
      ))}

      <RoundedBox args={[0.38, 0.72, 0.34]} radius={0.05} smoothness={3} position={[0, -1.76, -0.02]} castShadow>
        <meshStandardMaterial color="#10213a" metalness={0.58} roughness={0.42} />
      </RoundedBox>
      <RoundedBox args={[2.25, 0.2, 1.08]} radius={0.07} smoothness={3} position={[0, -2.14, 0.1]} castShadow receiveShadow>
        <meshStandardMaterial color="#172c49" metalness={0.58} roughness={0.38} />
        <Edges color="#f28c5a" threshold={22} />
      </RoundedBox>
    </group>
  );
}
function GlassLayers() {
  const layers = [
    { size: [4.5, 3.75] as const, position: [0.12, 0.08, -0.65] as const, rotation: 0.08, opacity: 0.08 },
    { size: [5.2, 4.35] as const, position: [-0.18, 0, -1.25] as const, rotation: -0.06, opacity: 0.045 },
  ];

  return (
    <group>
      {layers.map((layer, index) => (
        <mesh key={index} position={layer.position} rotation={[0, layer.rotation, 0]}>
          <planeGeometry args={layer.size} />
          <meshBasicMaterial color="#17345e" transparent opacity={layer.opacity} side={THREE.DoubleSide} depthWrite={false} />
          <Edges color="#f28c5a" threshold={15} />
        </mesh>
      ))}
    </group>
  );
}

function OrbitRing() {
  const ring = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!ring.current) return;
    ring.current.rotation.z += delta * (Math.PI * 2) / 26;
    ring.current.rotation.y = Math.sin(state.clock.elapsedTime / 4) * 0.08;
  });

  return (
    <group ref={ring} position={[0, -0.12, -1.5]} rotation={[0.08, 0.16, 0]} scale={[1, 0.58, 1]}>
      <mesh>
        <torusGeometry args={[2.85, 0.018, 8, 96]} />
        <meshBasicMaterial color="#f28c5a" transparent opacity={0.38} depthWrite={false} />
      </mesh>
      {[0, Math.PI / 2, Math.PI, Math.PI * 1.5].map((angle, index) => (
        <mesh key={angle} position={[Math.cos(angle) * 2.85, Math.sin(angle) * 2.85, 0]}>
          <boxGeometry args={[0.58, 0.16, 0.035]} />
          <meshBasicMaterial color={index === 0 ? "#f4a877" : "#244064"} transparent opacity={0.86} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}

function FloorGrid() {
  const grid = useRef<THREE.Object3D>(null);

  useFrame((_, delta) => {
    if (!grid.current) return;
    grid.current.position.z = (grid.current.position.z + delta * 0.23) % 0.7;
  });

  return (
    <group ref={grid} position={[0, -1.83, -0.8]}>
      <gridHelper args={[9, 18, "#b86547", "#17345e"]} />
      <mesh position={[0, 0.015, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[2.3, 48]} />
        <meshBasicMaterial color="#f28c5a" transparent opacity={0.055} depthWrite={false} />
      </mesh>
    </group>
  );
}

function Particles() {
  const particles = useRef<Array<THREE.Mesh | null>>([]);
  const positions = Array.from({ length: 14 }, (_, index) => {
    const angle = index * 2.39996;
    const radius = 2.8 + (index % 4) * 0.5;
    return [Math.cos(angle) * radius, ((index % 7) - 3) * 0.45, -3.2 + (index % 6) * 0.9] as const;
  });

  useFrame((state) => {
    particles.current.forEach((particle, index) => {
      if (!particle) return;
      particle.position.y = positions[index][1] + Math.sin(state.clock.elapsedTime * (0.7 + (index % 4) * 0.08) + index) * 0.14;
      particle.rotation.z = state.clock.elapsedTime * 0.3 + index;
    });
  });

  return (
    <group>
      {positions.map((position, index) => (
        <mesh key={index} ref={(element) => { particles.current[index] = element; }} position={position}>
          <planeGeometry args={[0.04 + (index % 3) * 0.015, 0.04 + (index % 3) * 0.015]} />
          <meshBasicMaterial color={index % 4 === 0 ? "#f28c5a" : "#8fa7c7"} transparent opacity={0.5} />
        </mesh>
      ))}
    </group>
  );
}

export function IntroScene({
  exiting,
  onFailure,
  onReady,
  pointer,
  progress,
}: {
  exiting: boolean;
  onFailure: () => void;
  onReady: () => void;
  pointer: PointerPosition;
  progress: number;
}) {
  return (
    <IntroSceneBoundary onFailure={onFailure}>
      <Canvas
        className="intro-canvas"
        dpr={[1, 1.5]}
        camera={{ position: [0, 0.4, 15], fov: 25 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        shadows
      >
        <SceneReady onReady={onReady} />
        <ambientLight intensity={0.58} color="#9db4d2" />
        <directionalLight castShadow color="#f4f1ea" intensity={1.8} position={[4, 6, 5]} />
        <pointLight color="#f28c5a" intensity={3.4} distance={7} position={[0, 1, 3]} />
        <pointLight color="#4a7bd0" intensity={2.8} distance={8} position={[-3, 2, -2]} />
        <GlassLayers />
        <OrbitRing />
        <FloorGrid />
        <Particles />
        <Terminal exiting={exiting} pointer={pointer} progress={progress} />
      </Canvas>
    </IntroSceneBoundary>
  );
}

