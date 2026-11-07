"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Edges } from "@react-three/drei";
import { Component, useRef } from "react";
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

function Terminal({ exiting, pointer, progress }: { exiting: boolean; pointer: PointerPosition; progress: number }) {
  const scene = useRef<THREE.Group>(null);
  const screen = useRef<THREE.MeshStandardMaterial>(null);
  const litSegments = Math.floor(progress / 5);

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

    if (screen.current) {
      screen.current.emissiveIntensity = 1.35 + Math.sin(state.clock.elapsedTime * 2.2) * 0.12;
    }
  });

  return (
    <group ref={scene} position={[0, 0, 0]}>
      <mesh position={[0, -1.35, 0.2]} receiveShadow>
        <boxGeometry args={[2.4, 0.2, 1.5]} />
        <meshStandardMaterial color="#10213a" metalness={0.7} roughness={0.3} />
        <Edges color="#f28c5a" threshold={15} />
      </mesh>

      <group position={[0, 0.1, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[3.4, 2.5, 1.1]} />
          <meshStandardMaterial color="#10213a" metalness={0.78} roughness={0.22} />
          <Edges color="#f28c5a" threshold={15} />
        </mesh>
        <mesh position={[0, 0.1, 0.57]}>
          <boxGeometry args={[3, 1.84, 0.025]} />
          <meshStandardMaterial
            ref={screen}
            color="#0a1a30"
            emissive="#f28c5a"
            emissiveIntensity={1.35}
            roughness={0.16}
          />
        </mesh>
        {Array.from({ length: 20 }, (_, index) => (
          <mesh key={index} position={[-1.22 + index * 0.128, -0.66, 0.6]}>
            <boxGeometry args={[0.08, 0.09, 0.03]} />
            <meshBasicMaterial color={index < litSegments ? "#f4a877" : "#10213a"} />
          </mesh>
        ))}
        {[0.62, 0.18, -0.28, -0.62].map((y, index) => (
          <mesh key={y} position={[-0.62 + index * 0.38, y, 0.61]}>
            <boxGeometry args={[0.12, 0.48 + index * 0.13, 0.03]} />
            <meshBasicMaterial color="#ffb18a" transparent opacity={0.72} />
          </mesh>
        ))}
        <mesh position={[0, -1.4, 0]}>
          <boxGeometry args={[0.32, 0.72, 0.28]} />
          <meshStandardMaterial color="#10213a" metalness={0.8} roughness={0.25} />
        </mesh>
        <mesh position={[0, -1.78, 0.14]}>
          <boxGeometry args={[1.5, 0.1, 0.72]} />
          <meshStandardMaterial color="#172b47" metalness={0.75} roughness={0.25} />
        </mesh>
      </group>

      {[[-0.46, -1.12], [0, -1.12], [0.46, -1.12]].map(([x, z], index) => (
        <mesh key={x} position={[x, -0.86, z]}>
          <sphereGeometry args={[0.055, 12, 12]} />
          <meshBasicMaterial color={index === 0 || (index === 1 && progress >= 55) || (index === 2 && progress >= 100) ? "#f28c5a" : "#162743"} />
        </mesh>
      ))}
    </group>
  );
}
function GlassLayers() {
  const layers = [
    { size: [4.6, 3.8] as const, position: [0, 0.1, -1.5] as const, rotation: 0.2, opacity: 0.2 },
    { size: [5.4, 4.4] as const, position: [-0.3, 0, -3] as const, rotation: 0.1, opacity: 0.12 },
    { size: [6.4, 5] as const, position: [0.1, -0.1, -4.6] as const, rotation: -0.07, opacity: 0.07 },
  ];

  return (
    <group>
      {layers.map((layer, index) => (
        <mesh key={index} position={layer.position} rotation={[0, layer.rotation, 0]}>
          <planeGeometry args={layer.size} />
          <meshBasicMaterial color="#17345e" transparent opacity={layer.opacity} side={THREE.DoubleSide} />
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
    <group ref={ring} position={[0, -0.4, -0.8]} rotation={[1.28, 0, 0]}>
      <mesh>
        <torusGeometry args={[3, 0.018, 8, 96]} />
        <meshBasicMaterial color="#f28c5a" transparent opacity={0.42} />
      </mesh>
      {[0, Math.PI / 2, Math.PI, Math.PI * 1.5].map((angle, index) => (
        <mesh key={angle} position={[Math.cos(angle) * 3, Math.sin(angle) * 3, 0]} rotation={[0, 0, -1.28]}>
          <boxGeometry args={[0.72, 0.22, 0.04]} />
          <meshBasicMaterial color={index === 0 ? "#f4a877" : "#244064"} transparent opacity={0.9} />
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
    <group ref={grid} position={[0, -1.46, -1]} rotation={[-Math.PI / 2, 0, 0]}>
      <gridHelper args={[18, 26, "#f28c5a", "#17345e"]} rotation={[Math.PI / 2, 0, 0]} />
      <mesh position={[0, 0, 0.1]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[2.4, 48]} />
        <meshBasicMaterial color="#f28c5a" transparent opacity={0.08} />
      </mesh>
    </group>
  );
}

function Particles() {
  const particles = useRef<Array<THREE.Mesh | null>>([]);
  const positions = Array.from({ length: 22 }, (_, index) => {
    const angle = index * 2.39996;
    const radius = 2.8 + (index % 5) * 0.5;
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
        onCreated={onReady}
      >
        <ambientLight intensity={0.25} color="#8fa7c7" />
        <directionalLight castShadow color="#e5ecf5" intensity={2.2} position={[3, 5, 4]} />
        <pointLight color="#f28c5a" intensity={6} distance={8} position={[0, 1, 2]} />
        <pointLight color="#4a7bd0" intensity={5} distance={8} position={[-3, 1, -3]} />
        <GlassLayers />
        <OrbitRing />
        <FloorGrid />
        <Particles />
        <Terminal exiting={exiting} pointer={pointer} progress={progress} />
      </Canvas>
    </IntroSceneBoundary>
  );
}

