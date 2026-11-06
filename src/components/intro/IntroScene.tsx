"use client";

import { Canvas, useFrame } from "@react-three/fiber";
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

function Workstation({ exiting }: { exiting: boolean }) {
  const scene = useRef<THREE.Group>(null);
  const screen = useRef<THREE.MeshStandardMaterial>(null);

  useFrame((state, delta) => {
    const targetZ = exiting ? 2.2 : 7.2;
    const targetY = exiting ? 0.45 : 1.65;
    state.camera.position.z = THREE.MathUtils.damp(
      state.camera.position.z,
      targetZ,
      exiting ? 2.8 : 1.8,
      delta,
    );
    state.camera.position.y = THREE.MathUtils.damp(
      state.camera.position.y,
      targetY,
      2.2,
      delta,
    );
    state.camera.lookAt(0, 0.55, 0);

    if (scene.current && !exiting) {
      scene.current.rotation.y = THREE.MathUtils.damp(
        scene.current.rotation.y,
        state.pointer.x * 0.08 - 0.18,
        3,
        delta,
      );
      scene.current.rotation.x = THREE.MathUtils.damp(
        scene.current.rotation.x,
        state.pointer.y * 0.035,
        3,
        delta,
      );
    }

    if (screen.current) {
      screen.current.emissiveIntensity = 1.2 + Math.sin(state.clock.elapsedTime * 2.2) * 0.08;
    }
  });

  return (
    <group ref={scene} rotation={[0, -0.18, 0]} position={[0, -0.8, 0]}>
      <mesh position={[0, -0.38, 0]} receiveShadow>
        <boxGeometry args={[5.6, 0.18, 3.2]} />
        <meshStandardMaterial color="#111820" metalness={0.7} roughness={0.3} />
      </mesh>

      <group position={[0, 0.65, -0.25]}>
        <mesh castShadow>
          <boxGeometry args={[3.05, 2.35, 0.42]} />
          <meshStandardMaterial color="#111a21" metalness={0.78} roughness={0.22} />
        </mesh>
        <mesh position={[0, 0.08, 0.225]}>
          <boxGeometry args={[2.55, 1.78, 0.025]} />
          <meshStandardMaterial
            ref={screen}
            color="#07151a"
            emissive="#42c6e8"
            emissiveIntensity={1.2}
            roughness={0.16}
          />
        </mesh>
        {[0.62, 0.18, -0.28, -0.62].map((y, index) => (
          <mesh key={y} position={[-0.62 + index * 0.38, y, 0.25]}>
            <boxGeometry args={[0.12, 0.48 + index * 0.13, 0.015]} />
            <meshBasicMaterial color="#a0efff" transparent opacity={0.72} />
          </mesh>
        ))}
        <mesh position={[0, -1.4, 0]}>
          <boxGeometry args={[0.32, 0.72, 0.28]} />
          <meshStandardMaterial color="#10171d" metalness={0.8} roughness={0.25} />
        </mesh>
        <mesh position={[0, -1.78, 0.14]}>
          <boxGeometry args={[1.5, 0.1, 0.72]} />
          <meshStandardMaterial color="#111920" metalness={0.75} roughness={0.25} />
        </mesh>
      </group>

      <mesh position={[0, -0.12, 1.05]} rotation={[-0.2, 0, 0]} castShadow>
        <boxGeometry args={[2.5, 0.12, 0.86]} />
        <meshStandardMaterial color="#10171d" metalness={0.65} roughness={0.3} />
      </mesh>

      <mesh position={[-2.05, 0.15, 0.25]} castShadow>
        <cylinderGeometry args={[0.38, 0.45, 1.05, 20]} />
        <meshStandardMaterial color="#121b22" metalness={0.72} roughness={0.24} />
      </mesh>
      <mesh position={[-2.05, 0.18, 0.25]}>
        <torusGeometry args={[0.25, 0.025, 8, 40]} />
        <meshBasicMaterial color="#78dcf5" />
      </mesh>
    </group>
  );
}

export function IntroScene({
  exiting,
  onFailure,
}: {
  exiting: boolean;
  onFailure: () => void;
}) {
  return (
    <IntroSceneBoundary onFailure={onFailure}>
      <Canvas
        className="intro-canvas"
        dpr={[1, 1.4]}
        camera={{ position: [0, 1.65, 7.2], fov: 38 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        shadows
      >
        <ambientLight intensity={0.42} color="#9ec7d1" />
        <directionalLight
          castShadow
          color="#d8f7ff"
          intensity={2.8}
          position={[3, 5, 4]}
        />
        <pointLight color="#42c6e8" intensity={12} distance={8} position={[0, 1, 2]} />
        <pointLight color="#4257e8" intensity={6} distance={7} position={[-3, 0, 1]} />
        <Workstation exiting={exiting} />
      </Canvas>
    </IntroSceneBoundary>
  );
}
